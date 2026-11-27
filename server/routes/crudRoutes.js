const express = require('express');
const { Crop, Activity, Irrigation, Expense, Harvest } = require('../models/FarmModels');

const router = express.Router();

function registerCrud(path, Model, preprocess = (body) => body) {
  router.get(path, async (req, res) => {
    try {
      const items = await Model.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post(path, async (req, res) => {
    try {
      const created = await Model.create(preprocess(req.body));
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.patch(`${path}/:id`, async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete(`${path}/:id`, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ deleted: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
}

registerCrud('/crops', Crop);
registerCrud('/activities', Activity);
registerCrud('/irrigations', Irrigation);
registerCrud('/expenses', Expense);
registerCrud('/harvests', Harvest, (body) => ({
  ...body,
  totalRevenue: Number(body.quantityKg || 0) * Number(body.pricePerKg || 0),
}));

module.exports = router;
