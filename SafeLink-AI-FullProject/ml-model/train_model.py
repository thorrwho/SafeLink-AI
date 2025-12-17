import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib
import sys
import json

# --- Download NLTK data (only needs to be done once) ---
try:
    stopwords.words('english')
except LookupError:
    nltk.download('stopwords')

# --- 1. Expanded Dataset Creation ---
# An expanded and more realistic synthetic dataset
data = {
    'text': [
        # Scams
        "Congratulations! You've won a $1,000 Walmart gift card. Go to http://bit.ly/w1n-c4sh to claim now.",
        "URGENT: Your account has been compromised. Please verify your details at http://secure-login-bank.com/auth",
        "Free Viagra trial! Click here for your discreet package: http://medz-online.info",
        "Hi mom, I lost my phone and wallet. Please send money to this new number ASAP. I'm in trouble.",
        "You have been selected for a secret shopper program. Earn $500 per day. Reply YES to start.",
        "Your computer has a virus! Call this number immediately toll-free to fix it before data loss.",
        "Your Netflix subscription is about to expire. Renew now at this special link to avoid interruption: http://netflx-renew.com",
        "We noticed unusual activity on your PayPal account. Log in here to confirm your identity: http://paypal-access-verify.xyz",
        "Claim your free cryptocurrency airdrop! Limited time offer for the first 1000 users. http://crypto-giveaway.io",
        "The IRS is filing a lawsuit against you. You must call this number within 24 hours to resolve the issue.",
        "A package is waiting for you but the shipping address is incomplete. Please update it here: http://shipping-update-express.co",
        "Your Apple ID is due to be terminated. Prevent this by logging in at: http://apple-id-support-case123.com",
        "Work from home opportunity: Earn $3000/week with no experience. All you need is a laptop. apy.biz/apply",
        "Final notice: Your student loan payment is overdue. Failure to respond will result in legal action.",
        "You've received a new photo from a friend. Click here to view: http://ph0t0-view.net/share?id=1234",

        # Not Scams
        "Your Amazon package is on its way. Track it here: http://amzn.to/tr4ck-pkg",
        "Exclusive deal: Get 25% off on all items this weekend. Shop now at our official store!",
        "Your meeting with the marketing team is confirmed for 3 PM tomorrow in Conference Room B.",
        "Don't forget to pick up milk, eggs, and bread on your way home tonight.",
        "Your invoice #89532 for order #7811 is attached. Please review and let us know if you have questions.",
        "Weekly newsletter: Top 10 tech trends of 2025 and an interview with our CEO.",
        "Click this link to securely reset your password for your social media account. The link is valid for 1 hour.",
        "A package from Etsy is waiting for you. The expected delivery date is tomorrow, June 5th.",
        "Thank you for signing up for our secret shopper program. Your first assignment details will be emailed shortly.",
        "Reminder from your IT department: Please be aware of phishing attempts. Never share your password.",
        "Hi, it's me from the party last night. It was great meeting you! Hope to see you again soon.",
        "Your order #54321 has been shipped. It will arrive in approximately 3-5 business days.",
        "Reminder: The parent-teacher meeting is scheduled for this Wednesday at 6 PM in the school auditorium.",
        "Can you help me with the project? I'm stuck on the data visualization part. I've attached my code.",
        "Check out these new photos I uploaded to our shared family album."
    ],
    'label': [
        'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam', 'scam',
        'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam', 'not_scam'
    ]
}
df = pd.DataFrame(data)

# --- 2. Text Preprocessing ---
def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    words = text.split()
    words = [word for word in words if word not in stop_words]
    # Stemming
    stemmer = PorterStemmer()
    words = [stemmer.stem(word) for word in words]
    return " ".join(words)

# --- 3. Prediction Function ---
def predict_text(text):
    try:
        model_path = 'model.pkl'
        vectorizer_path = 'vectorizer.pkl'
        
        # Load the saved model and vectorizer
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)

        # Preprocess the input text
        processed_text = preprocess_text(text)
        
        # Vectorize the text
        vectorized_text = vectorizer.transform([processed_text])
        
        # Make a prediction
        prediction_proba = model.predict_proba(vectorized_text)
        # Probability of the 'scam' class (assuming it's the second class)
        scam_prob_index = list(model.classes_).index('scam')
        risk_score = prediction_proba[0][scam_prob_index]
        
        label = 'scam' if risk_score > 0.5 else 'not_scam'
        
        # Prepare the output
        output = {
            'risk_score': f"{risk_score:.2f}",
            'label': label
        }
        return json.dumps(output)

    except Exception as e:
        error_output = {'error': str(e)}
        return json.dumps(error_output)

# --- 4. Model Training and Saving ---
def train_and_save_model():
    print("Starting model training with the expanded dataset...")
    
    # Apply preprocessing
    df['processed_text'] = df['text'].apply(preprocess_text)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        df['processed_text'], df['label'], test_size=0.25, random_state=42, stratify=df['label']
    )

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Logistic Regression model
    model = LogisticRegression()
    model.fit(X_train_vec, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test_vec)
    print(f"Model Accuracy on Test Set: {accuracy_score(y_test, y_pred):.2f}")

    # Save the model and vectorizer
    joblib.dump(model, 'model.pkl')
    joblib.dump(vectorizer, 'vectorizer.pkl')
    print("Model and vectorizer have been updated and saved to model.pkl and vectorizer.pkl")

# --- Main Execution Block ---
if __name__ == "__main__":
    if len(sys.argv) > 1:
        # If arguments are passed, it's for prediction
        input_text = sys.argv[1]
        print(predict_text(input_text))
    else:
        # Otherwise, train the model by default
        train_and_save_model()