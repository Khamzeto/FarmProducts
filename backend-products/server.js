const app = require('./app');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 5001; // Set your server's port here
const MONGO_URI = 'mongodb://localhost:27017/your_database_name'; // Replace with your MongoDB URI

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
