# SafeLink AI – Advanced Threat Detection System

This project is a full-stack web application designed to detect scams, fraud, and phishing attempts. It uses a machine learning model for text analysis, a rule-based system for URL inspection, and can extract and analyze text from documents, PDFs, and images.

The application features a modern, colorful, and creative user interface.

## 🌟 Features

- **Multi-Input Scanning**: Analyze content from three different sources:
    - **Text**: Paste any text content for direct analysis.
    - **URL**: Inspect URLs for suspicious patterns, lack of HTTPS, and malicious keywords.
    - **File Upload**: Upload documents (`.txt`, `.docx`), PDFs, and images (`.png`, `.jpg`) for automated text extraction (using OCR for images) and scanning.
- **Improved AI Model**: The text analysis model has been trained on an expanded dataset for better accuracy.
- **Creative UI**: A complete redesign featuring a more colorful and engaging user interface.
- **Visualized Results**: Scan results are displayed with a risk score gauge, clear labels, and highlighted keywords.
- **Analytics Dashboard**: Visualizes scan data, including total scans, scam vs. safe counts, and trends over time.
- **Scan Logging**: All scan results are stored in a MongoDB database for analysis.

##  Prerequisites

- Node.js and npm
- Python and pip
- A running MongoDB instance
- **For Image Scanning (Tesseract.js):** Depending on your system, you may need to install additional dependencies for `canvas` which `tesseract.js` uses. If you see errors during `npm install` related to `canvas`, please consult the `node-canvas` installation guide for your OS.

## Setup and Run Instructions

Follow the steps below to get the application running.

---

### 🤖 1. Machine Learning Model

First, set up the Python environment and train the improved model.

```bash
# Navigate to the ml-model directory
cd ml-model

# Install the required Python packages
pip install -r requirements.txt

# Run the training script to generate the latest model files
python train_model.py
```
You should see the improved model accuracy printed to the console.

---

### 🛠️ 2. Backend Server

Next, set up and run the Node.js backend. This now includes dependencies for file processing.

**Important:** Make sure your MongoDB server is running. The default connection string is `mongodb://localhost:27017/safelinkai`. You can change this in the `backend/.env` file if needed.

```bash
# Navigate to the backend directory
cd backend

# Install the npm dependencies (including multer, pdf-parse, tesseract, etc.)
npm install

# Start the server
node server.js
```
The backend server will start on `http://localhost:5000`. Keep this terminal window open.

---

### 🌐 3. Frontend Application

The frontend is served directly by the backend. Once the backend is running, you can access the application in your web browser.

1.  **Open your browser** and navigate to:
    [http://localhost:5000](http://localhost:5000)

2.  Use the new tabbed interface to choose your input method: **Text**, **URL**, or **File**.

3.  After a scan, you will be redirected to the redesigned **Results** page with a risk gauge and detailed analysis.

4.  Visit the **Dashboard** (`http://localhost:5000/dashboard.html`) to see the redesigned analytics on all scans performed.

---
That's it! The enhanced SafeLink AI application should now be fully functional on your local machine.