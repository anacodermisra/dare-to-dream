require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');

console.log("✅ adminRoutes loaded");



const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/public', publicRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/admin', adminRoutes);
console.log("✅ Admin routes registered");// ✅ only use — not define — it here

app.get('/', (req, res) => {
  res.send('Dare to Dream backend is live!');
});
app.get('/ping', (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
