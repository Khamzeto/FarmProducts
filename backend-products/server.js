const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5001; // Set your server's port here
const MONGO_URI = 'mongodb://localhost:27017/your_database_name'; // Replace with your MongoDB URI

const allowedOrigins = [
  'https://farm-front-three.vercel.app', // Ваш фронтенд4
];

// Настройка CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Разрешить запросы без источника (например, мобильные приложения или CURL)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Разрешить запрос
      } else {
        callback(new Error('Не разрешено политикой CORS')); // Отклонить запрос
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешённые методы
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
