const express = require('express');
const router = express.Router();
const {
    scanText,
    scanUrl,
    getDashboardData,
    scanFile,
} = require('../controllers/scanController');
const upload = require('../config/multerConfig');

// @route   POST /api/scan-text
// @desc    Scan text content
router.post('/scan-text', scanText);

// @route   POST /api/scan-url
// @desc    Scan a URL
router.post('/scan-url', scanUrl);

// @route   POST /api/scan-file
// @desc    Scan an uploaded file
router.post('/scan-file', upload.single('file'), scanFile);

// @route   GET /api/dashboard-data
// @desc    Get data for the analytics dashboard
router.get('/dashboard-data', getDashboardData);

module.exports = router;
