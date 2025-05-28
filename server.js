const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const allRouter = require('./modules');
const logger = require('./config/logger');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', allRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});


// For Countries

// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const payload = {
//     id: 1,
//     permissions: ['countries_read', 'countries_create', 'countries_update', 'countries_delete']
// };
// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

// console.log('New JWT Token:', token);


// For Cities

// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const payload = {
//     id: 1,
//     permissions: ['cities_read', 'cities_create', 'cities_update', 'cities_delete']
// };
// console.log('System Time During Generation:', new Date().toISOString());
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

// console.log('New JWT Token:', token);
// console.log('Decoded Token:', jwt.decode(token));