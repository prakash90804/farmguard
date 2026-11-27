import React, { useState } from 'react';

export default function CropsTab({ crops, onCreate, onUpdateStatus, onDelete }) {
  const [form, setForm] = useState({
    name: '',
    variety: '',
    areaAcres: '',
    sowingDate: '',
    expectedHarvestDate: '',
    status: 'Growing',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ ...form, areaAcres: Number(form.areaAcres) });
    setForm({
      name: '',
      variety: '',
      areaAcres: '',
      sowingDate: '',
      expectedHarvestDate: '',
      status: 'Growing',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
      >
        <h2 className="font-bold text-base">Register New Crop</h2>
        <input
          required
          placeholder="Crop Name (e.g., Samba Paddy)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Variety (e.g., BPT-5204)"
          value={form.variety}
          onChange={(e) => setForm({ ...form, variety: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          required
          type="number"
          step="0.1"
          placeholder="Area (Acres)"
          value={form.areaAcres}
          onChange={(e) => setForm({ ...form, areaAcres: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500">Sowing Date</label>
            <input
              required
              type="date"
              value={form.sowingDate}
              onChange={(e) => setForm({ ...form, sowingDate: e.target.value })}
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Expected Harvest</label>
            <input
              required
              type="date"
              value={form.expectedHarvestDate}
              onChange={(e) => setForm({ ...form, expectedHarvestDate: e.target.value })}
              className="w-full border rounded px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Add Crop
        </button>
      </form>

      <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="font-bold text-base mb-3">Active Crop Registry</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-2.5">Crop</th>
              <th className="p-2.5">Area</th>
              <th className="p-2.5">Harvest Target</th>
              <th className="p-2.5">Stage</th>
              <th className="p-2.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {crops.map((c) => (
              <tr key={c._id}>
                <td className="p-2.5 font-medium">
                  {c.name}
                  <span className="text-xs text-slate-400 block">{c.variety}</span>
                </td>
                <td className="p-2.5">{c.areaAcres} ac</td>
                <td className="p-2.5">{c.expectedHarvestDate}</td>
                <td className="p-2.5">
                  <select
                    value={c.status}
                    onChange={(e) => onUpdateStatus(c._id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs bg-emerald-50 text-emerald-900 font-medium"
                  >
                    {['Growing', 'Flowering', 'Ready to Harvest', 'Harvested'].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => onDelete(c._id)}
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
