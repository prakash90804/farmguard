async function fetchLiveWeather(lat, lon, city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OpenWeatherMap request failed');
    const data = await res.json();
    return {
      city: data.name || city,
      temperature: Math.round(data.main.temp * 10) / 10,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10,
      rainfallMm: data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0,
      rainProbability: data.rain ? 80 : 15,
      condition: data.weather?.[0]?.description || 'Clear sky',
      source: 'OpenWeatherMap',
    };
  }

  // Free Open-Meteo Forecast API (no API key required)
  const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=precipitation_probability_max&timezone=auto`;
  const res = await fetch(meteoUrl);
  if (!res.ok) throw new Error('Open-Meteo request failed');
  const data = await res.json();

  const rainProb = data.daily?.precipitation_probability_max?.[0] ?? 0;
  const rainMm = data.current?.precipitation ?? 0;

  return {
    city,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    rainfallMm: rainMm,
    rainProbability: rainProb,
    condition:
      rainMm > 0
        ? 'Active Rainfall'
        : rainProb > 50
        ? 'Cloudy / Rain Likely'
        : 'Clear / Partly Cloudy',
    source: 'Open-Meteo Live API',
  };
}

function generateRuleBasedAlerts(weather, irrigations = []) {
  const alerts = [];

  if (weather.rainfallMm > 2 || (weather.rainProbability ?? 0) >= 60) {
    alerts.push({
      id: 'rule-rain-skip',
      severity: 'warning',
      category: 'Irrigation Rule',
      title: 'Rain Forecasted – Skip Scheduled Irrigation',
      message: `Rain probability is ${weather.rainProbability ?? 75}% (${weather.rainfallMm} mm). Hold scheduled watering to prevent waterlogging.`,
    });
  }

  if (weather.temperature >= 35) {
    alerts.push({
      id: 'rule-heat-stress',
      severity: 'critical',
      category: 'Thermal Rule',
      title: 'High Heat Alert (Above 35°C)',
      message: `Current temperature is ${weather.temperature}°C. Schedule irrigation before 7:00 AM or after 6:00 PM to minimize evaporation.`,
    });
  }

  if (weather.humidity >= 82 && weather.temperature >= 18 && weather.temperature <= 29) {
    alerts.push({
      id: 'rule-fungal-risk',
      severity: 'warning',
      category: 'Crop Health Rule',
      title: 'High Fungal Blight & Mildew Risk',
      message: `Humidity at ${weather.humidity}% with ${weather.temperature}°C favors fungal leaf infections. Check field drainage and foliage.`,
    });
  }

  if (weather.windSpeed >= 22) {
    alerts.push({
      id: 'rule-wind-spray',
      severity: 'info',
      category: 'Activity Rule',
      title: 'High Wind Speed – Delay Foliar Spraying',
      message: `Wind speed is ${weather.windSpeed} km/h. Postpone pesticide or liquid fertilizer spraying to prevent drift.`,
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const dueToday = irrigations.filter(
    (item) => item.scheduledDate <= today && item.status === 'Scheduled'
  );
  if (dueToday.length > 0) {
    alerts.push({
      id: 'rule-irrigation-due',
      severity: 'info',
      category: 'Schedule Rule',
      title: `${dueToday.length} Irrigation Task(s) Due`,
      message: `Scheduled watering pending for: ${dueToday.map((i) => i.cropName).join(', ')}.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'rule-optimal',
      severity: 'success',
      category: 'All Clear',
      title: 'Favorable Field Conditions',
      message: 'Temperature, humidity, and wind speed are within optimal bounds for scheduled farm operations.',
    });
  }

  return alerts;
}

module.exports = { fetchLiveWeather, generateRuleBasedAlerts };
