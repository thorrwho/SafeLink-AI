// A simplified URL checker for demonstration purposes.
// In a real-world scenario, this would use external APIs for domain age, blacklists, etc.

const checkUrl = (url) => {
    let risk_score = 0;
    let explanation = [];

    // 1. Check for HTTPS
    if (!url.startsWith('https://')) {
        risk_score += 0.3;
        explanation.push('URL does not use a secure connection (HTTPS).');
    } else {
        explanation.push('URL uses a secure connection (HTTPS).');
    }

    // 2. Check for suspicious keywords
    const suspiciousKeywords = ['login', 'verify', 'account', 'secure', 'update', 'free', 'win', 'prize', 'gift'];
    const urlLower = url.toLowerCase();
    let foundKeywords = [];
    suspiciousKeywords.forEach(keyword => {
        if (urlLower.includes(keyword)) {
            risk_score += 0.1;
            foundKeywords.push(keyword);
        }
    });
    if (foundKeywords.length > 0) {
        explanation.push(`Contains suspicious keywords: ${foundKeywords.join(', ')}.`);
    }

    // 3. Simulate domain age check (very simplified)
    // A real implementation would use a WHOIS lookup API
    if (url.includes('bit.ly') || url.includes('.xyz') || url.includes('.info')) {
        risk_score += 0.4;
        explanation.push('URL uses a domain extension or shortener often associated with temporary or malicious sites.');
    }

    // 4. Check for long, complex URLs
    if (url.length > 75) {
        risk_score += 0.1;
        explanation.push('URL is unusually long, which can sometimes be used to hide the true domain.');
    }
    
    // Normalize risk score to be between 0 and 1
    risk_score = Math.min(risk_score, 1.0);

    return {
        risk_score: risk_score.toFixed(2),
        label: risk_score > 0.5 ? 'scam' : 'not_scam',
        explanation: explanation.join(' '),
    };
};

module.exports = { checkUrl };
