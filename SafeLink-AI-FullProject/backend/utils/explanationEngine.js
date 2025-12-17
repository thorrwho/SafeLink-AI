const generateTextExplanation = (text, label, risk_score) => {
    let explanation = '';
    let keywords = [];

    if (label === 'scam') {
        explanation = `This text is likely a scam with a risk score of ${risk_score}. `;
        const suspiciousKeywords = [
            'congratulations', 'won', 'prize', 'gift card', 'urgent', 'verify', 
            'account', 'compromised', 'free', 'trial', 'exclusive', 'deal', 
            'money', 'http', 'bit.ly', 'click', 'link'
        ];
        
        const textLower = text.toLowerCase();
        suspiciousKeywords.forEach(keyword => {
            if (textLower.includes(keyword)) {
                keywords.push(keyword);
            }
        });

        if (keywords.length > 0) {
            explanation += `It contains suspicious keywords such as: ${keywords.join(', ')}. These words are often used to create a sense of urgency or to lure you into clicking malicious links.`;
        } else {
            explanation += 'The language patterns are consistent with those often found in fraudulent messages.';
        }
    } else {
        explanation = `This text seems safe with a risk score of ${risk_score}. However, always be cautious with any links or requests for personal information.`;
    }

    return { explanation, keywords };
};

module.exports = { generateTextExplanation };
