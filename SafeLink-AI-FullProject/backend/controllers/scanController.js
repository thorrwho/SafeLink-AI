const ScanLog = require('../models/ScanLog');
const { classifyText } = require('../utils/textClassifier');
const { checkUrl } = require('../utils/urlChecker');
const { generateTextExplanation } = require('../utils/explanationEngine');

// @desc    Scan text for scams
// @route   POST /api/scan-text
// @access  Public
const scanText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        // Get prediction from Python model
        const classification = await classifyText(text);
        const risk_score = parseFloat(classification.risk_score);
        const label = classification.label;

        // Generate an explanation
        const { explanation, keywords } = generateTextExplanation(text, label, risk_score);
        
        const result = {
            risk_score,
            label,
            explanation,
            keywords
        };

        // Save to database
        const log = new ScanLog({
            type: 'text',
            content: text,
            result: result,
        });
        await log.save();

        res.json(result);

    } catch (error) {
        console.error('Error during text scan:', error);
        res.status(500).json({ error: 'Failed to scan text' });
    }
};

// @desc    Scan URL for scams
// @route   POST /api/scan-url
// @access  Public
const scanUrl = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Check URL using the utility
        const result = checkUrl(url);
        result.risk_score = parseFloat(result.risk_score);

        // Save to database
        const log = new ScanLog({
            type: 'url',
            content: url,
            result: result,
        });
        await log.save();

        res.json(result);
    } catch (error)
 {
        console.error('Error during URL scan:', error);
        res.status(500).json({ error: 'Failed to scan URL' });
    }
};

// @desc    Get dashboard data
// @route   GET /api/dashboard-data
// @access  Public
const getDashboardData = async (req, res) => {
    try {
        const totalScans = await ScanLog.countDocuments();
        const scamCount = await ScanLog.countDocuments({ 'result.label': 'scam' });
        const notScamCount = await ScanLog.countDocuments({ 'result.label': 'not_scam' });
        
        const recentScans = await ScanLog.find().sort({ timestamp: -1 }).limit(10);

        // Aggregate keywords
        const keywordAggregation = await ScanLog.aggregate([
            { $unwind: '$result.keywords' },
            { $group: { _id: '$result.keywords', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Aggregate daily usage
        const dailyUsage = await ScanLog.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);

        res.json({
            totalScans,
            scamCount,
            notScamCount,
            mostCommonKeywords: keywordAggregation,
            dailyUsage,
            recentScans
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};


const { processFile } = require('../utils/fileProcessor');

// @desc    Scan an uploaded file for scams
// @route   POST /api/scan-file
// @access  Public
const scanFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
    }

    try {
        // 1. Extract text from the file
        const text = await processFile(req.file);

        if (!text || text.trim() === '') {
            return res.json({
                risk_score: 0,
                label: 'not_scam',
                explanation: 'The file does not contain any readable text.',
                keywords: []
            });
        }
        
        // 2. Classify the extracted text
        const classification = await classifyText(text);
        const risk_score = parseFloat(classification.risk_score);
        const label = classification.label;

        // 3. Generate an explanation
        const { explanation, keywords } = generateTextExplanation(text, label, risk_score);
        
        const result = {
            risk_score,
            label,
            explanation,
            keywords
        };

        // 4. Save to database
        const log = new ScanLog({
            type: 'file',
            content: `File: ${req.file.originalname}`,
            result: result,
        });
        await log.save();

        res.json(result);

    } catch (error) {
        console.error('Error during file scan:', error);
        res.status(500).json({ error: `Failed to scan file: ${error.message}` });
    }
};


module.exports = {
    scanText,
    scanUrl,
    getDashboardData,
    scanFile,
};
