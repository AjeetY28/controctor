require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contractorRoutes = require('./routes/contractors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB(process.env.MONGO_URI);

app.use('/api/auth', authRoutes);
app.use('/api/contractors', contractorRoutes);

app.get('/', (req, res) => res.send('Contractor backend running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
