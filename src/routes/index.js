const express = require('express');
const router = express.Router();

const authRoutes = require('../features/Auth/auth.routes');
const userRoutes = require('../features/User/user.routes');
const templateRoutes = require('../features/Template/template.routes');
const dashboardRoutes = require('../features/Dashboard/dashboard.routes');
const printjobRoutes = require('../features/PrintJob/printjob.routes');
const reportRoutes = require('../features/Report/report.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/templates', templateRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/printjobs', printjobRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
