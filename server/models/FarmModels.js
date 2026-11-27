const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    variety: { type: String, default: 'Standard' },
    areaAcres: { type: Number, required: true, min: 0.1 },
    sowingDate: { type: String, required: true },
    expectedHarvestDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Growing', 'Flowering', 'Ready to Harvest', 'Harvested'],
      default: 'Growing',
    },
  },
  { timestamps: true }
);

const activitySchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    activityType: {
      type: String,
      enum: ['Soil Preparation', 'Sowing', 'Fertilizing', 'Weeding', 'Pesticide Spray'],
      required: true,
    },
    date: { type: String, required: true },
    assignedTo: { type: String, default: 'Farm Team' },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const irrigationSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    scheduledDate: { type: String, required: true },
    timeSlot: { type: String, default: '06:30 AM' },
    waterVolumeLiters: { type: Number, required: true, min: 1 },
    method: {
      type: String,
      enum: ['Drip', 'Sprinkler', 'Flood'],
      default: 'Drip',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Skipped'],
      default: 'Scheduled',
    },
  },
  { timestamps: true }
);

const expenseSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Seeds', 'Fertilizer', 'Pesticides', 'Labor', 'Irrigation', 'Equipment'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const harvestSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    harvestDate: { type: String, required: true },
    quantityKg: { type: Number, required: true, min: 1 },
    pricePerKg: { type: Number, required: true, min: 0 },
    totalRevenue: { type: Number, required: true },
    qualityGrade: {
      type: String,
      enum: ['Grade A', 'Grade B', 'Grade C'],
      default: 'Grade A',
    },
  },
  { timestamps: true }
);

module.exports = {
  Crop: mongoose.model('Crop', cropSchema),
  Activity: mongoose.model('Activity', activitySchema),
  Irrigation: mongoose.model('Irrigation', irrigationSchema),
  Expense: mongoose.model('Expense', expenseSchema),
  Harvest: mongoose.model('Harvest', harvestSchema),
};
