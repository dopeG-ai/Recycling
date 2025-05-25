const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
});
