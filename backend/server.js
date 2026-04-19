require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/reports', require('./src/routes/reports'));
app.use('/api/prescriptions', require('./src/routes/prescriptions'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/admin', require('./src/routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'SmartMed API' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SmartMed API running on port ${PORT}`));
