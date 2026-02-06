# RecoveryGuard AI - Post-Operative Recovery Monitoring System

An intelligent healthcare monitoring system that tracks daily recovery metrics using AI-powered trend analysis to identify deviations and alert care providers when reasoned thresholds are crossed.

## 🚀 Features

### 🤖 AI-Powered Monitoring
- **Baseline Calculation**: Establishes personalized baseline from 7+ days of patient data
- **Anomaly Detection**: Z-score statistical analysis (2.5σ warning, 3.5σ critical)
- **Trend Analysis**: Linear regression on pain/activity with confidence scoring
- **Smart Alerts**: Intelligent alerting logic with multi-factor evaluation

### 📊 Predictive Analytics
- **Recovery Velocity**: Real-time rate of improvement tracking
- **7-Day Pain Forecast**: Predicted pain levels with confidence bands
- **Complication Risk**: AI-calculated probability scoring (0-100%)
- **Recovery Timeline**: Milestone tracking with estimated completion dates

### 🏥 Clinical Features
- **Real-Time Vitals**: Pain, heart rate, activity level, temperature monitoring
- **Medical Report Analysis**: AI extraction of vitals from uploaded lab reports
- **Risk Assessment**: Dynamic risk scoring with identified factors
- **Clinical Monitor**: Live status dashboard with active alerts
- **AI Chatbot Assistant**: 24/7 conversational AI for health questions and guidance

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/1400x800/0f172a/14b8a6?text=Dashboard+Overview+-+Real-time+Vitals+%26+AI+Insights)
*Main dashboard showing real-time vitals, AI insights, and predictive analytics*

### Predictive Analytics
![Predictive Analytics](https://via.placeholder.com/1400x600/0f172a/14b8a6?text=Predictive+Analytics+-+Recovery+Velocity+%26+7-Day+Forecast)
*Recovery velocity, complication risk, and 7-day pain forecast*

### Clinical Monitor
![Clinical Monitor](https://via.placeholder.com/1400x600/0f172a/14b8a6?text=Clinical+Monitor+-+Live+Vitals+%26+Active+Alerts)
*Live vitals monitoring with next milestone and active alerts*

### Health Forecast
![Health Forecast](https://via.placeholder.com/1400x600/0f172a/14b8a6?text=Health+Forecast+-+Recovery+Timeline+%26+Milestones)
*Recovery timeline with milestone tracking and pain predictions*

### Risk Assessment
![Risk Assessment](https://via.placeholder.com/1400x600/0f172a/14b8a6?text=Risk+Assessment+-+Real-time+Scoring+%26+Factors)
*Real-time risk scoring with identified risk and protective factors*

### Medical Report Upload
![Report Upload](https://via.placeholder.com/1400x600/0f172a/14b8a6?text=Medical+Report+Upload+-+AI+Extraction)
*AI-powered extraction of vitals from uploaded medical reports*

### AI Chatbot Assistant
![Chatbot](https://via.placeholder.com/800x600/0f172a/14b8a6?text=AI+Chatbot+-+24/7+Health+Guidance)
*Conversational AI assistant for health questions, recovery insights, and app navigation*

> **Note**: Replace placeholder images with actual screenshots by following the [Screenshot Guide](screenshots/README.md)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance async Python web framework
- **MongoDB Atlas** - Cloud database with TLS security
- **Motor** - Async MongoDB driver (v3.7.1)
- **Pandas** - Data analysis (v3.0.0)
- **NumPy** - Numerical computing (v2.4.2)
- **SciPy** - Statistical analysis (v1.17.0)

### Frontend
- **React** - UI library (v19.2.0)
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool (v7.2.4)
- **Tailwind CSS** - Utility-first styling (v4.0.0)
- **Recharts** - Data visualization (v3.7.0)
- **Lucide React** - Icon library (v0.563.0)

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB Atlas account (or local MongoDB instance)

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Kruu Hackathon"
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Environment Configuration
Update MongoDB connection string in `backend/main.py`:
```python
MONGO_URL = "your_mongodb_connection_string"
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📊 Sample Data

To populate the database with sample data for testing:
```bash
python backend/mock_data_generator.py
```

This creates:
- 10 days of recovery metrics for user "ashmi"
- Simulated recovery progression (decreasing pain, increasing activity)

## 👤 Test Account

**Username**: ashmi  
**Password**: password123

## 🔍 API Endpoints

### Authentication
- `POST /register` - Create new user account
- `POST /login` - User login

### Metrics
- `POST /analyze` - Submit and analyze new health metrics
- `GET /history/{user_id}` - Retrieve user's metric history

### Reports
- `POST /upload-report` - Upload medical report for AI

### Chatbot
- `POST /chat` - Interact with AI health assistant analysis
- `GET /reports/{user_id}` - Get user's uploaded reports

### Alerts
- `GET /alerts/{user_id}` - Get active alerts for user

## 🧠 AI/ML Methods

### Statistical Analysis
- **Z-Score Anomaly Detection**: Identifies values 2.5σ+ from baseline
- **Linear Regression**: Analyzes trends with scipy.stats.linregress
- **Confidence Scoring**: Evaluates prediction reliability

### Baseline Calculation
- Requires minimum 7 days of data
- Calculates mean, standard deviation for personalized thresholds
- Updates dynamically as new data arrives

### Alert Thresholds
- **Warning**: 2.5σ deviation from baseline
- **Critical**: 3.5σ deviation or multiple risk factors
- **Provider Alert**: Critical status + trend deterioration

## 🎯 Project Problem Statement

Build a monitoring AI that:
1. Tracks daily recovery metrics (pain levels, activity, vitals)
2. Uses trend analysis to identify deviations from the norm
3. Alerts care providers only when specific, reasoned thresholds are crossed
4. Provides predictive insights for recovery timeline

## 📁 Project Structure

```
Kruu Hackathon/
├── backend/
│   ├── main.py                 # FastAPI app with AI monitoring engine
│   ├── mock_data_generator.py  # Sample data generator
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main application component
│   │   └── components/        # React components
│   │       ├── ClinicalMonitor.tsx
│   │       ├── PredictiveAnalytics.tsx
│   │       ├── HealthForecast.tsx
│   │       ├── RiskAssessment.tsx
│   │       ├── MetricLogForm.tsx
│   │       ├── StatusCard.tsx
│   │       └── ReportAnalysisDisplay.tsx
│   ├── package.json
│   └── vite.config.ts
├── sample_reports/            # Sample medical reports
│   ├── blood_test_report.txt
│   ├── xray_scan_report.txt
│   └── post_surgery_checkup.txt
└── README.md
```

## 🔐 Security Notes

- Current implementation uses basic authentication (development only)
- Production deployment requires:
  - Password hashing (bcrypt/argon2)
  - JWT tokens for session management
  - HTTPS/TLS encryption
  - Environment variables for secrets

## 📝 License

This project was created for the Kruu Hackathon.

## 👥 Contributing

This is a hackathon project. For issues or suggestions, please open a GitHub issue.

---

**RecoveryGuard OS Core v2.4.9** - Intelligent Post-Operative Monitoring System
