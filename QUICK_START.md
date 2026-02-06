# 🚀 Quick Start Guide - VitalSentinel AI Monitoring

## Complete Working System - Ready to Use!

### Step 1: Start Backend Server
```powershell
# The backend is already running in a separate PowerShell window
# If not, run:
cd "D:\Kruu Hackathon"
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Access Application
Open your browser to: **http://localhost:5174**

### Step 3: Login
```
Username: ashmi
Password: password123
```

---

## 🎯 How to Test the AI Monitoring System

### Test Scenario 1: Normal Recovery Pattern
1. **Log Daily Metrics** using the form:
   - Pain Level: 3
   - Temperature: 37.0°C
   - Heart Rate: 75 bpm
   - Activity: Medium

2. Click "LOG PROGRESS"

3. **Expected AI Response:**
   - Status: Normal ✅
   - Recovery Score: 70-85
   - Trend: Stable
   - No provider alert

4. Repeat 5-7 times with similar values to establish baseline

---

### Test Scenario 2: Warning Threshold
1. After establishing baseline, log:
   - Pain Level: 7
   - Temperature: 37.8°C
   - Heart Rate: 95 bpm
   - Activity: Low

2. **Expected AI Response:**
   - Status: Warning ⚠️
   - Anomaly detected (>2.5σ deviation)
   - Recovery Score: 50-70
   - Recommendation: Monitor closely
   - NO provider alert (unless trend is worsening)

---

### Test Scenario 3: Critical Alert
1. Log these values:
   - Pain Level: 9
   - Temperature: 38.7°C
   - Heart Rate: 72 bpm
   - Activity: Low

2. **Expected AI Response:**
   - Status: Critical 🚨
   - Multiple anomalies detected
   - Provider alert: YES ✅
   - Recommendation: IMMEDIATE_REVIEW_REQUIRED
   - Notification appears in alerts section

---

### Test Scenario 4: Report Upload with AI Extraction
1. Click "**UPLOAD LAB REPORT**" button (dark card on right)

2. Select file: `sample_reports/blood_test_report.txt`

3. **Expected AI Response:**
   - Report analyzed successfully
   - Metrics auto-extracted:
     - Temperature: 37.2°C
     - Heart Rate: 78 bpm
     - Pain: 2/10
   - Dashboard auto-updated with new metrics
   - "AI Insights" card shows analysis
   - Trend chart updates

4. Try other reports:
   - `xray_scan_report.txt`
   - `post_surgery_checkup.txt`

---

## 📊 Understanding AI Insights

### Recovery Score
- **70-100**: Excellent recovery ✅
- **50-69**: Fair progress ⚠️
- **0-49**: Concerning ⛔

### Trend Analysis
- **Improving**: Pain decreasing, activity increasing
- **Stable**: No significant changes
- **Declining**: Pain increasing or activity decreasing

### Anomaly Detection
- **Z-Score**: How many standard deviations from your baseline
  - <2.0σ: Normal variation
  - 2.5-3.5σ: Warning (yellow)
  - >3.5σ: Critical (red)

---

## 🧪 Advanced Testing

### Test Trend Analysis (5-7 days)
```
Day 1: Pain 5, HR 80 (baseline establishing)
Day 2: Pain 5, HR 78
Day 3: Pain 4, HR 76  ← Improving trend detected
Day 4: Pain 4, HR 75
Day 5: Pain 3, HR 74  ← AI confidence increases
Day 6: Pain 3, HR 72
Day 7: Pain 6, HR 90  ← WARNING: Reversal detected!
```

### Test Activity-Adjusted HR
```
Low Activity + HR 85:    Normal ✅
Low Activity + HR 110:   CRITICAL 🚨
High Activity + HR 110:  Normal ✅ (activity-adjusted threshold)
```

---

## 🔍 What to Look For

### 1. **AI Insights Card** (Right side)
- Shows recovery score
- Displays trend directions
- Lists detected anomalies
- Shows your personal baselines

### 2. **Vitality Trends Chart**
- Pain level (teal line)
- Heart rate (purple line)
- Hover for detailed tooltips
- See averages at bottom

### 3. **Status Card** (Top left)
- Overall health assessment
- AI-generated reasoning
- Color-coded status (green/yellow/red)

### 4. **Alerts Section** (Bottom)
- Shows critical alerts
- Provider notifications
- Alert history

---

## 💡 Tips for Best Results

1. **Log consistently** - AI needs 7+ entries for accurate baselines
2. **Be honest** - Accurate data = better predictions
3. **Upload reports** - Supplements manual entries
4. **Check trends** - Look at the chart, not just individual readings
5. **Trust the AI** - It uses your personal baseline, not generic thresholds

---

## 🐛 Troubleshooting

### Backend not responding?
```powershell
# Check if running on port 8000
netstat -ano | findstr :8000

# Restart if needed
cd "D:\Kruu Hackathon"
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend not loading?
```powershell
# Check if running on port 5174
cd "D:\Kruu Hackathon\frontend"
npm run dev
```

### Database connection issues?
- MongoDB Atlas connection is pre-configured
- Uses cloud database (no local setup needed)
- Check internet connection

---

## 📱 Features to Explore

✅ **Daily Check-in Form** - Manual metric entry
✅ **Report Upload** - AI extraction from medical documents
✅ **Trend Charts** - Visual history with averages
✅ **AI Insights** - Real-time analysis and predictions
✅ **Smart Alerts** - Context-aware notifications
✅ **Recovery Score** - Composite health metric
✅ **Provider Notifications** - Critical event alerting
✅ **Personal Baselines** - Individual threshold calculation

---

## 🎓 Understanding the AI

### How it learns your baseline:
1. Collects 7+ days of your data
2. Calculates mean (average) for each metric
3. Calculates standard deviation (normal variation)
4. Sets personalized thresholds based on YOUR patterns

### Why it doesn't alert on everything:
- Single outliers with stable trends = just monitoring
- Activity-adjusted expectations (HR higher when active = OK)
- Statistical confidence levels (need strong evidence)
- Alert fatigue prevention (only meaningful warnings)

---

## 🎯 Success Criteria Met

✅ Tracks daily recovery metrics
✅ Uses statistical trend analysis
✅ Identifies deviations from personal norm
✅ Alerts only on reasoned thresholds
✅ Provides context and explanations
✅ Real-time AI insights
✅ Full working implementation

---

## 📞 Support

System is fully functional and ready to demo!

**Test User:**
- Username: ashmi
- Password: password123

**Backend API:** http://localhost:8000
**Frontend UI:** http://localhost:5174
**API Docs:** http://localhost:8000/docs

---

Enjoy exploring the AI-powered recovery monitoring system! 🚀
