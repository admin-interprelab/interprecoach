const express = require('express');
const app = express();
const port = 8081;

app.get('/', (req, res) => {
  res.send('Session & Data Management Service is running!');
});

app.listen(port, () => {
  console.log(`Session & Data Management Service listening at http://localhost:${port}`);
});