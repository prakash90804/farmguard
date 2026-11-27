import React, { useState } from 'react';

export default function IrrigationTab({ irrigations, onCreate, onUpdateStatus, onDelete }) {
  const [form, setForm] = useState({
    cropName: '',
    scheduledDate: '',
    timeSlot: '06:30 AM',
    waterVolumeLiters: '',
    method: 'Drip',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...form,
      waterVolumeLiters: Number(form.waterVolumeLiters),
      status: 'Scheduled',
    });
    setForm({
      cropName: '',
      scheduledDate: '',
      timeSlot: '06:30 AM',
      waterVolumeLiters: '',
      method: 'Drip',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
      >
        <h2 className="font-bold text-base">Schedule Irrigation</h2>
        <input
          required
          placeholder="Crop Name"
          value={form.cropName}
          onChange={(e) => setForm({ ...form, cropName: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          required
          type="date"
          value={form.scheduledDate}
          onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Time Slot"
            value={form.timeSlot}
            onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="Drip">Drip</option>
            <option value="Sprinkler">Sprinkler</option>
            <option value="Flood">Flood</option>
          </select>
        </div>
        <input
          required
          type="number"
          placeholder="Water Volume (Liters)"
          value={form.waterVolumeLiters}
          onChange={(e) => setForm({ ...form, waterVolumeLiters: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full bg-sky-700 hover:bg-sky-800 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Add Schedule
        </button>
      </form>

      <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="font-bold text-base mb-3">Irrigation Schedule</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-2.5">Crop</th>
              <th className="p-2.5">Date & Slot</th>
              <th className="p-2.5">Volume / Method</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {irrigations.map((i) => (
              <tr key={i._id}>
                <td className="p-2.5 font-medium">{i.cropName}</td>
                <td className="p-2.5">{i.scheduledDate} • {i.timeSlot}</td>
                <td className="p-2.5">
                  {Number(i.waterVolumeLiters).toLocaleString()} L ({i.method})
                </td>
                <td className="p-2.5">
                  <div className="flex gap-1">
                    {['Scheduled', 'Completed', 'Skipped'].map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateStatus(i._id, st)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          i.status === st
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => onDelete(i._id)}
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
