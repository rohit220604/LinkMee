require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');


require('./config/googleAuth');

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(passport.initialize());

const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linkRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log('MongoDB connected');
    app.listen(PORT, () => {
      // console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
