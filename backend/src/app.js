const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
// Next modules plug in here, e.g. app.use('/api/resources', require('./routes/resourceRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
