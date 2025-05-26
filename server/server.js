const mongoose = require('mongoose');
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://rohit:OhqBExTWSeD0Q7yg@cluster0.yajqoq8.mongodb.net/';

app.use(express.json());

// Root route for quick check
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Test route
app.post('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Connect to MongoDB first, then start server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.use('/api/users', userRoutes);
