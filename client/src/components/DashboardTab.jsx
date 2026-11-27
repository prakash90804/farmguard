import React from 'react';

export default function DashboardTab({
  crops,
  activities,
  irrigations,
  expenses,
  harvests,
  weather,
  alerts,
}) {
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalRevenue = harvests.reduce((s, h) => s + Number(h.totalRevenue), 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalArea = crops.reduce((s, c) => s + Number(c.areaAcres), 0).toFixed(1);

  const badgeStyle = (severity) => {
    if (severity === 'critical') return 'bg-red-50 border-red-300 text-red-900';
    if (severity === 'warning') return 'bg-amber-50 border-amber-300 text-amber-900';
    if (severity === 'success') return 'bg-emerald-50 border-emerald-300 text-emerald-900';
    return 'bg-sky-50 border-sky-300 text-sky-900';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Active Crops</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {crops.filter((c) => c.status !== 'Harvested').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">{totalArea} Acres Total</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Pending Irrigations</p>
          <p className="text-2xl font-bold text-sky-700 mt-1">
            {irrigations.filter((i) => i.status === 'Scheduled').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {activities.filter((a) => a.status === 'Pending').length} Field Activities Due
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Expenses</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            ₹{totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">{expenses.length} Recorded Entries</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">Net Farm Profit</p>
          <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            ₹{netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Revenue: ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-800 text-white p-5 rounded-xl shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-200">Real-Time Weather</p>
              <h2 className="text-xl font-bold mt-0.5">{weather.city}</h2>
            </div>
            <span className="text-xs bg-white/15 px-2 py-1 rounded">{weather.condition}</span>
          </div>
          <p className="text-4xl font-extrabold my-4">{weather.temperature}°C</p>
          <div className="grid grid-cols-3 gap-2 text-xs bg-black/20 p-3 rounded-lg">
            <div>
              <p className="text-emerald-200">Humidity</p>
              <p className="font-bold text-sm">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-emerald-200">Wind</p>
              <p className="font-bold text-sm">{weather.windSpeed} km/h</p>
            </div>
            <div>
              <p className="text-emerald-200">Rain</p>
              <p className="font-bold text-sm">{weather.rainfallMm} mm</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-800">Rule-Based Decision Alerts</h2>
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-3.5 rounded-lg border ${badgeStyle(alert.severity)}`}>
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-sm">{alert.title}</span>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-white/70">
                  {alert.category}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
