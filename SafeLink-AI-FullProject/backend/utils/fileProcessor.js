const fs = require('fs');
const pdf = require('pdf-parse');
const WordExtractor = require('word-extractor');
const { createWorker } = require('tesseract.js');

const getTextFromPdf = async (filePath) => {
    console.log('Starting PDF extraction...');
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        console.log('Finished PDF extraction.');
        return data.text;
    } catch (error) {
        console.error('Error processing PDF file:', error);
        throw new Error('Failed to process PDF file.');
    }
};

const getTextFromDocx = async (filePath) => {
    console.log('Starting DOCX extraction...');
    try {
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(filePath);
        console.log('Finished DOCX extraction.');
        return extracted.getBody();
    } catch (error) {
        console.error('Error processing DOCX file:', error);
        throw new Error('Failed to process DOCX file.');
    }
};

const getTextFromTxt = async (filePath) => {
    console.log('Starting TXT extraction...');
    try {
        const text = fs.readFileSync(filePath, 'utf-8');
        console.log('Finished TXT extraction.');
        return text;
    } catch (error) {
        console.error('Error processing TXT file:', error);
        throw new Error('Failed to process TXT file.');
    }
};

const getTextFromImage = async (filePath) => {
    console.log('Starting Image (OCR) extraction... This may take a moment.');
    try {
        const worker = await createWorker('eng', 1, {
            logger: m => console.log(m) // Log Tesseract progress
        });
        const { data: { text } } = await worker.recognize(filePath);
        await worker.terminate();
        console.log('Finished Image (OCR) extraction.');
        return text;
    } catch (error) {
        console.error('Error processing image file with Tesseract:', error);
        throw new Error('Failed to perform OCR on image. Please check server logs for Tesseract issues.');
    }
};

const processFile = async (file) => {
    const filePath = file.path;
    const mimeType = file.mimetype;
    console.log(`Processing file: ${file.originalname} (MIME: ${mimeType})`);

    let text = '';

    try {
        if (mimeType === 'application/pdf') {
            text = await getTextFromPdf(filePath);
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            text = await getTextFromDocx(filePath);
        } else if (mimeType === 'text/plain') {
            text = await getTextFromTxt(filePath);
        } else if (['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
            text = await getTextFromImage(filePath);
        } else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }
    } catch (error) {
        // Re-throw the specific error from the extraction functions
        console.error(`Error in processFile for ${file.originalname}:`, error);
        throw error;
    } finally {
        // Clean up the uploaded file after processing, regardless of success or failure
        console.log(`Cleaning up file: ${filePath}`);
        fs.unlinkSync(filePath);
    }
    
    return text;
};

module.exports = { processFile };

