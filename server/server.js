require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const crudRoutes = require('./routes/crudRoutes');
const dashboardRoute = require('./routes/dashboardRoute');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farmguard';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.use('/api', crudRoutes);
app.use('/api/dashboard', dashboardRoute);

app.listen(PORT, () => {
  console.log(`FarmGuard API running on http://localhost:${PORT}`);
});
