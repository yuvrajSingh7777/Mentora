const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
connectDB();

app.get('/', (req, res) => {
  res.send('Mentora API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));