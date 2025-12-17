const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Determines if the input is a URL.
 * @param {string} input The string to check.
 * @returns {boolean} True if the input is a URL, false otherwise.
 */
const isUrl = (input) => {
    try {
        new URL(input);
        // Additional check for common patterns that new URL() might miss for local use
        return input.startsWith('http://') || input.startsWith('https://') || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(input);
    } catch (_) {
        return false;
    }
};


/**
 * Scans the given input (text or URL).
 * @param {string} input The text or URL to scan.
 * @returns {Promise<object>} The result from the API.
 */
const scanInput = async (input) => {
    const endpoint = isUrl(input) ? 'scan-url' : 'scan-text';
    const body = isUrl(input) ? { url: input } : { text: input };

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        return await response.json();

    } catch (error) {
        console.error(`Error scanning ${endpoint}:`, error);
        throw error;
    }
};


/**
 * Uploads and scans a file.
 * @param {File} file The file to scan.
 * @returns {Promise<object>} The result from the API.
 */
const scanFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/scan-file`, {
            method: 'POST',
            body: formData, // The browser will automatically set the Content-Type header
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        }

        return await response.json();

    } catch (error) {
        console.error('Error scanning file:', error);
        throw error;
    }
};

/**
 * Fetches dashboard analytics data.
 * @returns {Promise<object>} The dashboard data from the API.
 */
const getDashboardData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard-data`);

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        return await response.json();

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};
