const express = require('express');
const connectDB = require('./config/db');
const logRoutes = require('./routes/logRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// MVP: Context layer
connectDB();

// MCP: Protocol layer
app.use('/api/logs', logRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Log Maintainer Backend is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
