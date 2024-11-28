const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const amqp = require('amqplib');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Import route modules
const transactionRoutes = require('./routes/transactions');
const transferRoutes = require('./routes/transfer');
const balanceRoutes = require('./routes/balance');

// Load environment variables
dotenv.config();

// Initialize the app and configure middleware
const app = express();
app.use(bodyParser.json()); // to parse incoming JSON requests

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Logger setup using Winston
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE }),
    new winston.transports.Console(),
  ],
});

// RabbitMQ connection
let channel;
amqp.connect(process.env.RABBITMQ_URL).then((conn) => conn.createChannel())
  .then((ch) => {
    channel = ch;
    logger.info('Connected to RabbitMQ');
  })
  .catch((err) => logger.error('Failed to connect to RabbitMQ', err));

// API Routes
app.use('/api', transactionRoutes);
app.use('/api', transferRoutes);
app.use('/api', balanceRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Fund Transfer API');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Export the server and database for use in route files
module.exports = { app, db, logger };
