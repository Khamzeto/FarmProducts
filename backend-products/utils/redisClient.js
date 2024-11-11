const redis = require('redis');

// Create a new Redis client instance
const redisClient = redis.createClient({
  host: '127.0.0.1', // Set to your Redis host, if it's different
  port: 6379, // Default Redis port
});

// Log errors and successful connection
redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

redisClient.connect();

module.exports = redisClient;
