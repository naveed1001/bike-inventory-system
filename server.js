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

// const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Load .env

// const payload = {
//     id: 1,
//     permissions: ['banking_details_read', 'banking_details_create', 'banking_details_update', 'banking_details_delete']
// };
// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

// console.log('New JWT Token:', token);