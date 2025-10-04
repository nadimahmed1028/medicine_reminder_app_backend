const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const medicineRoutes = require('./routes/medicineRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', medicineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
