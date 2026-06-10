const express = require('express');
const cors = require('cors');
const path = require('path');
const graphRoutes = require('./routes/graph');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Body parser
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Routes
app.use('/api/graph', graphRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
