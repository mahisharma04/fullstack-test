const express = require('express');
const router = express.Router();
const { processGraph } = require('../logic/processGraph');

// POST /api/graph
router.post('/', (req, res) => {
  try {
    const { edges } = req.body;

    // Validation: missing or not an array
    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({ 
        error: "missing -> edges array required" 
      });
    }

    // Call processing logic
    const result = processGraph(edges);

    // Return result
    res.status(200).json(result);
  } catch (error) {
    // Catch-all for internal errors
    res.status(500).json({ 
      error: error.message 
    });
  }
});

module.exports = router;
