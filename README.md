SafeLink-AI
Deployed Link- https://pngd79pm-5000.inc1.devtunnels.ms/
AI-powered malicious link detection system

SafeLink-AI is a security-focused application designed to detect malicious or unsafe URLs using machine learning.
It helps users identify phishing, malware, and suspicious links before interacting with them.

📌 Project Overview

Malicious links are a major attack vector for phishing and malware distribution.
SafeLink-AI analyzes URLs using a trained ML model and predicts whether a link is safe or malicious.

The project is divided into three independent components:

Frontend – User interface

Backend – API & prediction logic

ML Model – Training and feature extraction

🧠 Key Features

Detects malicious URLs using ML

Clean separation of frontend, backend, and ML logic

Lightweight and modular design

Easy to retrain model with new data

Secure repository (no model files exposed)

🏗️ Project Structure
SafeLink-AI-FullProject
│
├── backend/          # API & server-side logic
├── frontend/         # User interface
│
├── ml-model/         # Machine learning module
│   ├── train_model.py
│   └── requirements.txt
│
├── README.md
└── .gitignore

⚙️ Tech Stack
Machine Learning

Python

Scikit-learn

NLP feature extraction

Backend

Python

Flask / FastAPI (based on implementation)

Frontend

HTML / CSS / JavaScript (or React if used)

Tools

Git & GitHub

VS Code

🚀 How to Run the Project
1️⃣ Clone the Repository
git clone https://github.com/thorrwho/SafeLink-AI.git
cd SafeLink-AI-FullProject

2️⃣ Set Up ML Environment
cd ml-model
pip install -r requirements.txt
python train_model.py


Note: Trained model files are intentionally excluded from GitHub for security and size reasons.

3️⃣ Start Backend Server
cd backend
python app.py

4️⃣ Run Frontend

Open index.html
OR

Start frontend server (if React)

🔐 Security Note

Trained model files (.pkl) are excluded using .gitignore

This prevents accidental exposure of large or sensitive files

Models can be regenerated locally using the training script

🎓 Academic Use

This project is suitable for:

AI / ML Mini Projects

Cyber Security demonstrations

Full-stack ML applications

Viva and project evaluations

👤 Author

Tharini Naveen, Tasheen Khan, Malavika I R
B.Tech – Artificial Intelligence & Machine Learning
Vidyavardhaka College of Engineering

📜 License

This project is intended for educational purposes only.
