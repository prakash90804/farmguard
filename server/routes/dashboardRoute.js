const express = require('express');
const { Crop, Activity, Irrigation, Expense, Harvest } = require('../models/FarmModels');
const { fetchLiveWeather, generateRuleBasedAlerts } = require('../utils/alertEngine');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lat = req.query.lat || process.env.DEFAULT_LAT || 13.0827;
    const lon = req.query.lon || process.env.DEFAULT_LON || 80.2707;
    const city = req.query.city || process.env.DEFAULT_CITY || 'Chennai';

    const [crops, activities, irrigations, expenses, harvests, weather] = await Promise.all([
      Crop.find(),
      Activity.find(),
      Irrigation.find(),
      Expense.find(),
      Harvest.find(),
      fetchLiveWeather(lat, lon, city),
    ]);

    const alerts = generateRuleBasedAlerts(weather, irrigations);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = harvests.reduce((sum, h) => sum + h.totalRevenue, 0);
    const totalArea = crops.reduce((sum, c) => sum + c.areaAcres, 0);

    res.json({
      weather,
      alerts,
      metrics: {
        activeCrops: crops.filter((c) => c.status !== 'Harvested').length,
        totalAreaAcres: Math.round(totalArea * 10) / 10,
        pendingIrrigations: irrigations.filter((i) => i.status === 'Scheduled').length,
        pendingActivities: activities.filter((a) => a.status === 'Pending').length,
        totalExpenses,
        totalRevenue,
        netProfit: totalRevenue - totalExpenses,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
