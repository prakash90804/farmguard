import React, { useState } from 'react';

export default function ActivitiesTab({ activities, onCreate, onUpdateStatus, onDelete }) {
  const [form, setForm] = useState({
    cropName: '',
    activityType: 'Fertilizing',
    date: '',
    assignedTo: '',
    status: 'Pending',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
    setForm({
      cropName: '',
      activityType: 'Fertilizing',
      date: '',
      assignedTo: '',
      status: 'Pending',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
      >
        <h2 className="font-bold text-base">Log Farming Activity</h2>
        <input
          required
          placeholder="Crop Name"
          value={form.cropName}
          onChange={(e) => setForm({ ...form, cropName: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <select
          value={form.activityType}
          onChange={(e) => setForm({ ...form, activityType: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          {['Soil Preparation', 'Sowing', 'Fertilizing', 'Weeding', 'Pesticide Spray'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          required
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Assigned Worker / Team"
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Save Activity
        </button>
      </form>

      <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="font-bold text-base mb-3">Field Activity Log</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-2.5">Activity</th>
              <th className="p-2.5">Crop</th>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {activities.map((a) => (
              <tr key={a._id}>
                <td className="p-2.5 font-medium">
                  {a.activityType}
                  <span className="text-xs text-slate-400 block">{a.assignedTo || 'Farm Team'}</span>
                </td>
                <td className="p-2.5">{a.cropName}</td>
                <td className="p-2.5">{a.date}</td>
                <td className="p-2.5">
                  <button
                    onClick={() => onUpdateStatus(a._id, a.status === 'Pending' ? 'Completed' : 'Pending')}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      a.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {a.status}
                  </button>
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => onDelete(a._id)}
                    className="text-rose-600 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
