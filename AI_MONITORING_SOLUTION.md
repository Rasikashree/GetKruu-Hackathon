# VitalSentinel - AI-Powered Recovery Monitoring System

## 🎯 Problem Statement Solution

**Challenge:** Build a monitoring AI that tracks daily recovery metrics (pain levels, activity, simple vitals). It should use trend analysis to identify deviations from the norm and alert care providers only when a specific, reasoned threshold is crossed.

**Solution:** VitalSentinel is an intelligent healthcare monitoring system that uses advanced statistical analysis, machine learning techniques, and smart alerting to monitor patient recovery while minimizing false alarms.

---

## 🧠 Core AI Features

### 1. **Baseline Establishment**
- Automatically establishes personalized baseline metrics from 7+ days of data
- Calculates mean and standard deviation for each vital sign
- Adapts to individual patient patterns (not one-size-fits-all)

### 2. **Multi-Metric Anomaly Detection**
Uses Z-score statistical analysis to detect deviations:
- **Pain Level**: Triggers at 2.5σ (Warning) or 3.5σ (Critical)
- **Temperature**: Absolute threshold (>38°C) + statistical deviation
- **Heart Rate**: Activity-adjusted thresholds with multipliers:
  - Low activity: 1.0x baseline
  - Medium activity: 1.2x baseline
  - High activity: 1.5x baseline

### 3. **Trend Analysis**
- **Linear Regression** on pain and activity levels
- **Confidence Scoring** using correlation coefficients
- **Predictive Analytics** forecasting next expected values
- **Recovery Velocity** tracking rate of improvement/decline

### 4. **Intelligent Alerting Logic**
Provider alerts ONLY when:
- ✅ **Critical thresholds** exceeded (>3.5σ deviation)
- ✅ **Warning + negative trend** (multiple concerning signals)
- ✅ **Multiple concurrent warnings** (≥2 anomalies)
- ❌ NOT on single isolated warnings with stable trends
- ❌ NOT on minor fluctuations within normal range

### 5. **Recovery Score Calculation**
Composite metric combining:
- Inverse pain levels (lower pain = higher score)
- Activity progression
- Trend velocity
- Range: 0-100 (70+ = Good, 50-69 = Fair, <50 = Concerning)

---

## 📊 How It Works

### Data Flow
```
Patient Logs Metrics
       ↓
Stored in MongoDB
       ↓
AI Engine Analyzes:
  - Calculates baseline from history
  - Detects anomalies (Z-score method)
  - Analyzes trends (regression)
  - Computes recovery score
       ↓
Smart Alert Decision:
  - Evaluates severity
  - Considers trend direction
  - Checks alert history
       ↓
Action Taken:
  ✓ Normal: Continue monitoring
  ⚠ Warning: Flag for review
  🚨 Critical: Alert provider immediately
```

### Statistical Methods Used

1. **Z-Score Anomaly Detection**
   ```
   Z = (X - μ) / σ
   where:
   X = current value
   μ = baseline mean
   σ = standard deviation
   ```

2. **Linear Regression for Trends**
   ```python
   slope, intercept, r_value = scipy.stats.linregress(time, metrics)
   ```

3. **Activity-Adjusted HR Thresholds**
   ```
   Expected HR = Baseline × Activity_Multiplier + 2σ
   ```

---

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Test with Sample Data
```bash
# Use provided sample medical reports
1. Login with: ashmi / password123
2. Upload: sample_reports/blood_test_report.txt
3. Log daily metrics via the form
4. Watch AI insights update in real-time
```

---

## 📈 AI Monitoring Capabilities

### Real-Time Analysis
- ✓ Continuous baseline adjustment
- ✓ Per-user personalized thresholds
- ✓ Multi-dimensional anomaly detection
- ✓ Trend forecasting

### Alert Intelligence
- ✓ Severity classification (Warning/Critical)
- ✓ Context-aware decision making
- ✓ Alert cooldown (prevent spam)
- ✓ Provider notification system

### Insights Dashboard
- ✓ Recovery score visualization
- ✓ Trend direction indicators
- ✓ Confidence levels for predictions
- ✓ Anomaly details with explanations
- ✓ Personalized baseline display

---

## 🎓 Key Algorithms

### 1. Baseline Calculator
```python
def calculate_baseline(history):
    df = pd.DataFrame(history)
    return {
        'pain_mean': df['pain_level'].mean(),
        'pain_std': df['pain_level'].std(),
        'temp_mean': df['temperature'].mean(),
        'temp_std': df['temperature'].std(),
        'hr_mean': df['heart_rate'].mean(),
        'hr_std': df['heart_rate'].std()
    }
```

### 2. Anomaly Detector
```python
def detect_anomalies(current, baseline):
    anomalies = []
    z_score = abs(current - baseline['mean']) / baseline['std']
    
    if z_score > 2.5:  # Statistical significance
        severity = "CRITICAL" if z_score > 3.5 else "WARNING"
        anomalies.append({
            'severity': severity,
            'zscore': z_score,
            'message': f"Deviation of {z_score}σ detected"
        })
    
    return anomalies
```

### 3. Smart Alert Logic
```python
def should_alert_provider(anomalies, trends):
    # Critical always alerts
    if any(a['severity'] == 'CRITICAL' for a in anomalies):
        return True
    
    # Warning + negative trend
    if anomalies and trends['pain']['direction'] == 'increasing':
        return True
    
    # Multiple warnings
    if len(anomalies) >= 2:
        return True
    
    return False
```

---

## 📱 Features

### Patient Dashboard
- Daily check-in form for metrics
- Medical report upload with AI extraction
- Visual trend charts
- Real-time health score
- Alert notifications

### AI Insights Panel
- Recovery score (0-100)
- Trend analysis (improving/declining/stable)
- Confidence levels
- Anomaly warnings
- Personalized baselines
- Recommendations

### Provider Alerts
- CRITICAL: Immediate review required
- WARNING: Schedule follow-up
- Detailed context and reasoning
- Statistical evidence (Z-scores)

---

## 🔧 Technology Stack

### Backend
- **FastAPI**: High-performance API framework
- **MongoDB**: Flexible document storage
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **SciPy**: Statistical analysis
- **Motor**: Async MongoDB driver

### Frontend
- **React + TypeScript**: Type-safe UI
- **Vite**: Fast build tool
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Lucide Icons**: Modern icons

---

## 📊 Sample Metrics & Thresholds

### Pain Level (0-10 scale)
- Baseline: User-specific average
- Warning: >2.5σ deviation
- Critical: >3.5σ deviation OR level ≥8

### Temperature (°C)
- Baseline: User-specific (typically ~37°C)
- Warning: >38°C or >2σ
- Critical: >38.5°C

### Heart Rate (bpm)
- Baseline: User-specific, activity-adjusted
- Warning: >Baseline + 2σ for activity level
- Critical: >Baseline + 3σ for activity level

---

## 🧪 Testing Scenarios

### Test 1: Normal Recovery
```
Log daily with:
- Pain: 3-4/10 (decreasing trend)
- Temp: 37.0-37.2°C
- HR: 70-80 bpm
- Activity: Medium

Expected: "Normal" status, positive trend indicators
```

### Test 2: Warning Threshold
```
Log with:
- Pain: 6-7/10 (>2.5σ above baseline)
- Temp: 37.5°C
- HR: 85 bpm

Expected: "Warning" status, no provider alert (unless trending worse)
```

### Test 3: Critical Alert
```
Log with:
- Pain: 9/10 OR
- Temp: 38.8°C OR
- HR: 120 bpm (Low activity)

Expected: "Critical" status, immediate provider alert
```

---

## 🎯 Problem Statement Compliance

✅ **Tracks daily recovery metrics**: Pain, temperature, heart rate, activity
✅ **Uses trend analysis**: Linear regression with confidence scoring
✅ **Identifies deviations from norm**: Z-score statistical method
✅ **Reasoned thresholds**: Context-aware, personalized baselines
✅ **Smart provider alerts**: Only on critical/multi-warning scenarios

---

## 📝 API Endpoints

### POST /analyze
Analyzes metrics and returns AI insights
```json
{
  "status": "Normal|Warning|Critical",
  "reason": "Human-readable explanation",
  "alert_provider": boolean,
  "ai_insights": {
    "recovery_score": 85,
    "trends": {...},
    "anomalies_detected": 0,
    "baseline": {...}
  }
}
```

### GET /alerts/{user_id}
Retrieves all alerts for a user

### POST /upload-report
Analyzes medical reports and extracts vitals

### GET /history/{user_id}
Gets historical metrics for trend analysis

---

## 🔒 Security & Privacy

- User authentication required
- Data encrypted in transit
- MongoDB Atlas secure cloud storage
- Per-user data isolation
- HIPAA-compliant architecture ready

---

## 📚 Future Enhancements

- [ ] Machine learning model training on larger datasets
- [ ] Multi-variate correlation analysis
- [ ] Medication interaction tracking
- [ ] Circadian rhythm analysis
- [ ] Provider dashboard with patient overview
- [ ] Mobile app with push notifications
- [ ] Integration with wearable devices
- [ ] Predictive hospitalization risk scoring

---

## 👥 Contributors

Built for Kruu Hackathon 2026

---

## 📄 License

MIT License - See LICENSE file for details
