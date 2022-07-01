// Requirements
const express = require('express');

// Initialization
const app = express();


// our first Route
app.get('/', (req, res, next) => {
    res.send('<h1>Welcome Ironhacker. :)</h1>');
});

// Export
module.exports = app;