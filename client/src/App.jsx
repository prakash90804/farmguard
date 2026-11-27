import React, { useState, useEffect, useCallback } from 'react';
import DashboardTab from './components/DashboardTab';
import CropsTab from './components/CropsTab';
import ActivitiesTab from './components/ActivitiesTab';
import IrrigationTab from './components/IrrigationTab';
import { ExpensesTab, HarvestsTab } from './components/FinanceTabs';

const API_BASE = 'http://localhost:5000/api';

const LOCATIONS = [
  { city: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { city: 'Thanjavur', lat: 10.787, lon: 79.1378 },
  { city: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
  { city: 'Madurai', lat: 9.9252, lon: 78.1198 },
];

const DEMO_DATA = {
  crops: [
    { _id: 'c1', name: 'Samba Paddy', variety: 'BPT-5204', areaAcres: 3.5, sowingDate: '2026-09-15', expectedHarvestDate: '2027-01-10', status: 'Growing' },
    { _id: 'c2', name: 'Hybrid Tomato', variety: 'Arka Rakshak', areaAcres: 1.5, sowingDate: '2026-10-05', expectedHarvestDate: '2026-12-28', status: 'Flowering' },
  ],
  activities: [
    { _id: 'a1', cropName: 'Samba Paddy', activityType: 'Fertilizing', date: '2026-11-27', assignedTo: 'Ramesh', status: 'Pending' },
    { _id: 'a2', cropName: 'Hybrid Tomato', activityType: 'Weeding', date: '2026-11-24', assignedTo: 'Karthik', status: 'Completed' },
  ],
  irrigations: [
    { _id: 'i1', cropName: 'Hybrid Tomato', scheduledDate: '2026-11-27', timeSlot: '06:30 AM', waterVolumeLiters: 1800, method: 'Drip', status: 'Scheduled' },
    { _id: 'i2', cropName: 'Samba Paddy', scheduledDate: '2026-11-28', timeSlot: '07:00 AM', waterVolumeLiters: 4500, method: 'Flood', status: 'Scheduled' },
  ],
  expenses: [
    { _id: 'e1', cropName: 'Samba Paddy', category: 'Seeds', amount: 4200, date: '2026-09-14', description: 'Certified paddy seeds' },
    { _id: 'e2', cropName: 'Hybrid Tomato', category: 'Fertilizer', amount: 3100, date: '2026-10-20', description: 'NPK 19:19:19 & micronutrients' },
  ],
  harvests: [
    { _id: 'h1', cropName: 'Groundnut (Previous Cycle)', harvestDate: '2026-09-02', quantityKg: 950, pricePerKg: 62, totalRevenue: 58900, qualityGrade: 'Grade A' },
  ],
};

function evaluateFallbackAlerts(w, irrList) {
  const rules = [];
  if (w.rainfallMm > 2 || (w.rainProbability ?? 0) >= 60) {
    rules.push({
      id: 'rain',
      severity: 'warning',
      category: 'Irrigation Rule',
      title: 'Rain Forecasted – Skip Scheduled Irrigation',
      message: `Rain probability is ${w.rainProbability ?? 70}% (${w.rainfallMm} mm). Hold scheduled watering to prevent waterlogging.`,
    });
  }
  if (w.temperature >= 35) {
    rules.push({
      id: 'heat',
      severity: 'critical',
      category: 'Thermal Rule',
      title: 'High Heat Alert (Above 35°C)',
      message: `Temperature is ${w.temperature}°C. Schedule irrigation before 7:00 AM or after 6:00 PM.`,
    });
  }
  if (w.humidity >= 82 && w.temperature >= 18 && w.temperature <= 29) {
    rules.push({
      id: 'fungal',
      severity: 'warning',
      category: 'Crop Health Rule',
      title: 'Fungal Blight Risk Window',
      message: `High humidity (${w.humidity}%) at ${w.temperature}°C increases fungal infection risk.`,
    });
  }
  if (w.windSpeed >= 22) {
    rules.push({
      id: 'wind',
      severity: 'info',
      category: 'Activity Rule',
      title: 'High Wind Speed – Delay Foliar Spraying',
      message: `Wind speed is ${w.windSpeed} km/h. Avoid spraying to prevent chemical drift.`,
    });
  }
  const dueCount = irrList.filter((i) => i.status === 'Scheduled').length;
  if (dueCount > 0) {
    rules.push({
      id: 'irr',
      severity: 'info',
      category: 'Irrigation Queue',
      title: `${dueCount} Scheduled Irrigation(s) Active`,
      message: 'Review scheduled water volumes against current rain conditions.',
    });
  }
  if (rules.length === 0) {
    rules.push({
      id: 'ok',
      severity: 'success',
      category: 'All Clear',
      title: 'Favorable Field Conditions',
      message: 'All weather parameters are within safe thresholds.',
    });
  }
  return rules;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [apiOnline, setApiOnline] = useState(true);

  const [crops, setCrops] = useState(DEMO_DATA.crops);
  const [activities, setActivities] = useState(DEMO_DATA.activities);
  const [irrigations, setIrrigations] = useState(DEMO_DATA.irrigations);
  const [expenses, setExpenses] = useState(DEMO_DATA.expenses);
  const [harvests, setHarvests] = useState(DEMO_DATA.harvests);

  const [weather, setWeather] = useState({
    city: 'Chennai',
    temperature: 30.2,
    humidity: 76,
    windSpeed: 12.5,
    rainfallMm: 0,
    rainProbability: 20,
    condition: 'Partly Cloudy',
  });
  const [alerts, setAlerts] = useState([]);

  const loadAllData = useCallback(async (loc) => {
    try {
      const [dashRes, cRes, aRes, iRes, eRes, hRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard?lat=${loc.lat}&lon=${loc.lon}&city=${loc.city}`),
        fetch(`${API_BASE}/crops`),
        fetch(`${API_BASE}/activities`),
        fetch(`${API_BASE}/irrigations`),
        fetch(`${API_BASE}/expenses`),
        fetch(`${API_BASE}/harvests`),
      ]);
      if (!dashRes.ok) throw new Error('Backend offline');
      const [dashData, cData, aData, iData, eData, hData] = await Promise.all([
        dashRes.json(),
        cRes.json(),
        aRes.json(),
        iRes.json(),
        eRes.json(),
        hRes.json(),
      ]);
      setApiOnline(true);
      setWeather(dashData.weather);
      setAlerts(dashData.alerts);
      setCrops(cData);
      setActivities(aData);
      setIrrigations(iData);
      setExpenses(eData);
      setHarvests(hData);
    } catch {
      setApiOnline(false);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=precipitation_probability_max&timezone=auto`
        );
        const m = await res.json();
        const liveW = {
          city: loc.city,
          temperature: m.current.temperature_2m,
          humidity: m.current.relative_humidity_2m,
          windSpeed: m.current.wind_speed_10m,
          rainfallMm: m.current.precipitation,
          rainProbability: m.daily?.precipitation_probability_max?.[0] ?? 15,
          condition: m.current.precipitation > 0 ? 'Active Rainfall' : 'Clear / Partly Cloudy',
        };
        setWeather(liveW);
        setAlerts(evaluateFallbackAlerts(liveW, DEMO_DATA.irrigations));
      } catch {
        setAlerts(evaluateFallbackAlerts(weather, DEMO_DATA.irrigations));
      }
    }
  }, []);

  useEffect(() => {
    loadAllData(location);
  }, [location, loadAllData]);

  const handleCreate = async (endpoint, payload, setter, list) => {
    if (apiOnline) {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadAllData(location);
        return;
      }
    }
    const localItem = {
      ...payload,
      _id: `${endpoint}-${Date.now()}`,
      ...(endpoint === 'harvests'
        ? { totalRevenue: Number(payload.quantityKg) * Number(payload.pricePerKg) }
        : {}),
    };
    const updated = [localItem, ...list];
    setter(updated);
    if (endpoint === 'irrigations') setAlerts(evaluateFallbackAlerts(weather, updated));
  };

  const handleStatusUpdate = async (endpoint, id, newStatus, setter, list) => {
    if (apiOnline) {
      await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await loadAllData(location);
      return;
    }
    const updated = list.map((item) => (item._id === id ? { ...item, status: newStatus } : item));
    setter(updated);
    if (endpoint === 'irrigations') setAlerts(evaluateFallbackAlerts(weather, updated));
  };

  const handleDelete = async (endpoint, id, setter, list) => {
    if (apiOnline) {
      await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
      await loadAllData(location);
      return;
    }
    const updated = list.filter((item) => item._id !== id);
    setter(updated);
    if (endpoint === 'irrigations') setAlerts(evaluateFallbackAlerts(weather, updated));
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalRevenue = harvests.reduce((s, h) => s + Number(h.totalRevenue), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-emerald-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">FarmGuard</h1>
            <p className="text-xs text-emerald-200">
              Smart Crop Monitoring & Farm Management System (MERN)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={location.city}
              onChange={(e) => setLocation(LOCATIONS.find((l) => l.city === e.target.value))}
              className="bg-emerald-900 text-white text-sm px-3 py-1.5 rounded border border-emerald-600"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.city} value={loc.city}>{loc.city}</option>
              ))}
            </select>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                apiOnline ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
              }`}
            >
              {apiOnline ? 'MongoDB API Connected' : 'Local Demo Mode'}
            </span>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto pb-2">
          {[
            ['dashboard', 'Dashboard & Alerts'],
            ['crops', `Crops (${crops.length})`],
            ['activities', `Activities (${activities.length})`],
            ['irrigation', `Irrigation (${irrigations.length})`],
            ['expenses', `Expenses (₹${totalExpenses.toLocaleString()})`],
            ['harvests', `Harvests (₹${totalRevenue.toLocaleString()})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
                activeTab === key
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            crops={crops}
            activities={activities}
            irrigations={irrigations}
            expenses={expenses}
            harvests={harvests}
            weather={weather}
            alerts={alerts}
          />
        )}

        {activeTab === 'crops' && (
          <CropsTab
            crops={crops}
            onCreate={(data) => handleCreate('crops', data, setCrops, crops)}
            onUpdateStatus={(id, st) => handleStatusUpdate('crops', id, st, setCrops, crops)}
            onDelete={(id) => handleDelete('crops', id, setCrops, crops)}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitiesTab
            activities={activities}
            onCreate={(data) => handleCreate('activities', data, setActivities, activities)}
            onUpdateStatus={(id, st) => handleStatusUpdate('activities', id, st, setActivities, activities)}
            onDelete={(id) => handleDelete('activities', id, setActivities, activities)}
          />
        )}

        {activeTab === 'irrigation' && (
          <IrrigationTab
            irrigations={irrigations}
            onCreate={(data) => handleCreate('irrigations', data, setIrrigations, irrigations)}
            onUpdateStatus={(id, st) => handleStatusUpdate('irrigations', id, st, setIrrigations, irrigations)}
            onDelete={(id) => handleDelete('irrigations', id, setIrrigations, irrigations)}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            totalExpenses={totalExpenses}
            onCreate={(data) => handleCreate('expenses', data, setExpenses, expenses)}
            onDelete={(id) => handleDelete('expenses', id, setExpenses, expenses)}
          />
        )}

        {activeTab === 'harvests' && (
          <HarvestsTab
            harvests={harvests}
            totalRevenue={totalRevenue}
            onCreate={(data) => handleCreate('harvests', data, setHarvests, harvests)}
            onDelete={(id) => handleDelete('harvests', id, setHarvests, harvests)}
          />
        )}
      </main>
    </div>
  );
}
