const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const documentRoutes = require('./routes/documentRoutes');
const scrutinyRoutes = require('./routes/scrutinyRoutes');
const momRoutes = require('./routes/momRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const exportRoutes = require('./routes/exportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transparencyRoutes = require('./modules/publicTransparency/transparencyRoutes');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Too many authentication requests' },
});

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server tools and local frontend origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '5mb' }));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, data: null, message: 'PARIVESH 3.0 API running' });
});

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/scrutiny', scrutinyRoutes);
app.use('/api/v1/mom', momRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/public', transparencyRoutes);

app.use(errorHandler);

module.exports = app;
