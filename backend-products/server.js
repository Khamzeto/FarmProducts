const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5001; // Set your server's port here
const MONGO_URI = 'mongodb://localhost:27017/your_database_name'; // Replace with your MongoDB URI

const allowedOrigins = [
  'https://farm-front-15x1.vercel.app', // Ваш фронтенд
];
app.use(
  cors({
    origin: 'https://farm-front-15x1.vercel.app', // Ваш фронтенд
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные HTTP-методы
    credentials: true, // Если требуется передача cookies
  })
);

// Подключение к MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ваши маршруты здесь

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
