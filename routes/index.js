const express = require('express');
const router = express.Router();

const { roleRouter } = require('../MODULES');

router.use("/roles", roleRouter);