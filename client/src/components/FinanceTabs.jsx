import React, { useState } from 'react';

export function ExpensesTab({ expenses, totalExpenses, onCreate, onDelete }) {
  const [form, setForm] = useState({
    cropName: '',
    category: 'Fertilizer',
    amount: '',
    date: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ ...form, amount: Number(form.amount) });
    setForm({ cropName: '', category: 'Fertilizer', amount: '', date: '', description: '' });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
      >
        <h2 className="font-bold text-base">Record Farm Expense</h2>
        <input
          required
          placeholder="Crop Name"
          value={form.cropName}
          onChange={(e) => setForm({ ...form, cropName: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          {['Seeds', 'Fertilizer', 'Pesticides', 'Labor', 'Irrigation', 'Equipment'].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          required
          type="number"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          required
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Log Expense
        </button>
      </form>

      <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="font-bold text-base mb-3">
          Expense Ledger (Total: ₹{totalExpenses.toLocaleString()})
        </h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Crop</th>
              <th className="p-2.5">Category</th>
              <th className="p-2.5">Amount</th>
              <th className="p-2.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.map((ex) => (
              <tr key={ex._id}>
                <td className="p-2.5">{ex.date}</td>
                <td className="p-2.5 font-medium">
                  {ex.cropName}
                  <span className="text-xs text-slate-400 block">{ex.description}</span>
                </td>
                <td className="p-2.5">{ex.category}</td>
                <td className="p-2.5 font-semibold text-rose-600">
                  ₹{Number(ex.amount).toLocaleString()}
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => onDelete(ex._id)}
                    className="text-slate-500 text-xs hover:text-rose-600"
                  >
                    Remove
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

export function HarvestsTab({ harvests, totalRevenue, onCreate, onDelete }) {
  const [form, setForm] = useState({
    cropName: '',
    harvestDate: '',
    quantityKg: '',
    pricePerKg: '',
    qualityGrade: 'Grade A',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...form,
      quantityKg: Number(form.quantityKg),
      pricePerKg: Number(form.pricePerKg),
    });
    setForm({
      cropName: '',
      harvestDate: '',
      quantityKg: '',
      pricePerKg: '',
      qualityGrade: 'Grade A',
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3"
      >
        <h2 className="font-bold text-base">Record Harvest Yield</h2>
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
          value={form.harvestDate}
          onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            required
            type="number"
            placeholder="Quantity (kg)"
            value={form.quantityKg}
            onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            placeholder="Price / kg (₹)"
            value={form.pricePerKg}
            onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <select
          value={form.qualityGrade}
          onChange={(e) => setForm({ ...form, qualityGrade: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="Grade A">Grade A (Premium)</option>
          <option value="Grade B">Grade B (Standard)</option>
          <option value="Grade C">Grade C (Processing)</option>
        </select>
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Record Harvest
        </button>
      </form>

      <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="font-bold text-base mb-3">
          Harvest & Revenue Records (Total: ₹{totalRevenue.toLocaleString()})
        </h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Crop</th>
              <th className="p-2.5">Yield</th>
              <th className="p-2.5">Rate</th>
              <th className="p-2.5">Revenue</th>
              <th className="p-2.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {harvests.map((h) => (
              <tr key={h._id}>
                <td className="p-2.5">{h.harvestDate}</td>
                <td className="p-2.5 font-medium">
                  {h.cropName}
                  <span className="text-xs text-slate-400 block">{h.qualityGrade}</span>
                </td>
                <td className="p-2.5">{Number(h.quantityKg).toLocaleString()} kg</td>
                <td className="p-2.5">₹{h.pricePerKg}/kg</td>
                <td className="p-2.5 font-bold text-emerald-700">
                  ₹{Number(h.totalRevenue).toLocaleString()}
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => onDelete(h._id)}
                    className="text-slate-500 text-xs hover:text-rose-600"
                  >
                    Remove
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
