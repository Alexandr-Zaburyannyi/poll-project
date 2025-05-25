/** @format */

require('dotenv').config();
const express = require('express');
const db = require('./db/setup.js');
const routes = require('./routes/index.js');
const { initializeAuth } = require('./middleware/auth.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

initializeAuth(app);

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
