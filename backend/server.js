require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',          require('./src/routes/auth'));
app.use('/api/reports',       require('./src/routes/reports'));
app.use('/api/prescriptions', require('./src/routes/prescriptions'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/admin',         require('./src/routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'SmartMed API' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SmartMed API running on port ${PORT}`));
