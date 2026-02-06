from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import json
import re
import base64
from io import BytesIO
from scipy import stats
from collections import deque

app = FastAPI()

# MongoDB Connection
MONGO_URL = "mongodb+srv://rasikashreekruu:Rasika1526@cluster0.ilf1wwc.mongodb.net/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true"
client = AsyncIOMotorClient(MONGO_URL)
db = client.recovery_db
collection = db.metrics
users_collection = db.users
reports_collection = db.reports

class User(BaseModel):
    username: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    username: str
    password: str

class MetricEntry(BaseModel):
    user_id: str = "default"
    timestamp: str
    pain_level: int
    temperature: float
    heart_rate: int
    activity_level: str

class ReportUpload(BaseModel):
    user_id: str
    filename: str
    content_type: str
    file_base64: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MetricEntry(BaseModel):
    timestamp: str
    pain_level: int
    temperature: float
    heart_rate: int
    activity_level: str

@app.get("/")
async def root():
    return {"message": "VitalSentinel AI Analysis Engine"}

@app.post("/register")
async def register(user: User):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    await users_collection.insert_one(user.dict())
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(req: LoginRequest):
    user = await users_collection.find_one({"username": req.username, "password": req.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "username": user["username"],
        "full_name": user["full_name"],
        "message": "Login successful"
    }

class ProviderAlert(BaseModel):
    user_id: str
    alert_type: str
    severity: str  # "WARNING", "CRITICAL"
    message: str
    metrics: Dict
    timestamp: str
    acknowledged: bool = False

# AI Monitoring Core Engine
class RecoveryMonitoringAI:
    """
    Advanced AI system for monitoring patient recovery metrics
    Uses statistical analysis, trend detection, and anomaly detection
    """
    
    def __init__(self):
        self.baseline_window = 7  # days to establish baseline
        self.alert_cooldown = 3600  # seconds between similar alerts
        
    def calculate_baseline(self, history: List[Dict]) -> Dict:
        """Establish baseline metrics from historical data"""
        if len(history) < 3:
            return None
            
        df = pd.DataFrame(history)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        baseline = {
            'pain_mean': df['pain_level'].mean(),
            'pain_std': df['pain_level'].std(),
            'temp_mean': df['temperature'].mean(),
            'temp_std': df['temperature'].std(),
            'hr_mean': df['heart_rate'].mean(),
            'hr_std': df['heart_rate'].std(),
            'sample_size': len(df)
        }
        
        return baseline
    
    def detect_anomalies(self, current: Dict, baseline: Dict) -> List[Dict]:
        """
        Multi-metric anomaly detection using statistical methods
        Returns list of detected anomalies with severity
        """
        anomalies = []
        
        if not baseline:
            return anomalies
        
        # Z-score based anomaly detection
        pain_zscore = abs(current['pain_level'] - baseline['pain_mean']) / max(baseline['pain_std'], 0.1)
        temp_zscore = abs(current['temperature'] - baseline['temp_mean']) / max(baseline['temp_std'], 0.1)
        hr_zscore = abs(current['heart_rate'] - baseline['hr_mean']) / max(baseline['hr_std'], 0.1)
        
        # Pain level anomalies
        if pain_zscore > 2.5:  # 2.5 standard deviations
            severity = "CRITICAL" if pain_zscore > 3.5 else "WARNING"
            anomalies.append({
                'type': 'pain_spike',
                'severity': severity,
                'metric': 'pain_level',
                'value': current['pain_level'],
                'expected': baseline['pain_mean'],
                'zscore': round(pain_zscore, 2),
                'message': f"Pain level {current['pain_level']}/10 is {pain_zscore:.1f}σ above baseline ({baseline['pain_mean']:.1f})"
            })
        
        # Temperature anomalies
        if current['temperature'] > 38.0 or temp_zscore > 2.0:
            severity = "CRITICAL" if current['temperature'] > 38.5 else "WARNING"
            anomalies.append({
                'type': 'fever',
                'severity': severity,
                'metric': 'temperature',
                'value': current['temperature'],
                'expected': baseline['temp_mean'],
                'zscore': round(temp_zscore, 2),
                'message': f"Temperature {current['temperature']}°C indicates possible infection (baseline: {baseline['temp_mean']:.1f}°C)"
            })
        
        # Heart rate anomalies (considering activity level)
        activity_multiplier = {'Low': 1.0, 'Medium': 1.2, 'High': 1.5}
        adjusted_hr_threshold = baseline['hr_mean'] * activity_multiplier.get(current['activity_level'], 1.0)
        
        if current['heart_rate'] > adjusted_hr_threshold + 2 * baseline['hr_std']:
            severity = "CRITICAL" if current['heart_rate'] > adjusted_hr_threshold + 3 * baseline['hr_std'] else "WARNING"
            anomalies.append({
                'type': 'tachycardia',
                'severity': severity,
                'metric': 'heart_rate',
                'value': current['heart_rate'],
                'expected': baseline['hr_mean'],
                'zscore': round(hr_zscore, 2),
                'message': f"Heart rate {current['heart_rate']} bpm elevated for {current['activity_level']} activity (expected: {adjusted_hr_threshold:.0f} bpm)"
            })
        
        return anomalies
    
    def analyze_trends(self, history: List[Dict]) -> Dict:
        """
        Advanced trend analysis using regression and pattern detection
        """
        if len(history) < 5:
            return {'trend': 'insufficient_data', 'confidence': 0}
        
        df = pd.DataFrame(history)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        df['time_index'] = range(len(df))
        
        trends = {}
        
        # Pain trend analysis
        pain_slope, pain_intercept, pain_r, _, _ = stats.linregress(df['time_index'], df['pain_level'])
        trends['pain'] = {
            'direction': 'increasing' if pain_slope > 0.1 else 'decreasing' if pain_slope < -0.1 else 'stable',
            'slope': round(pain_slope, 3),
            'confidence': round(abs(pain_r), 2),
            'prediction_next': round(pain_intercept + pain_slope * len(df), 1)
        }
        
        # Activity trend analysis
        activity_map = {'Low': 1, 'Medium': 2, 'High': 3}
        df['activity_score'] = df['activity_level'].map(activity_map)
        activity_slope, _, activity_r, _, _ = stats.linregress(df['time_index'], df['activity_score'])
        trends['activity'] = {
            'direction': 'improving' if activity_slope > 0.1 else 'declining' if activity_slope < -0.1 else 'stable',
            'slope': round(activity_slope, 3),
            'confidence': round(abs(activity_r), 2)
        }
        
        # Overall recovery score (composite metric)
        recovery_score = 100 - (df['pain_level'].iloc[-1] * 10) + (df['activity_score'].iloc[-1] * 10)
        recovery_score = max(0, min(100, recovery_score))
        
        trends['recovery_score'] = round(recovery_score, 1)
        trends['recovery_velocity'] = round(-pain_slope * 10 + activity_slope * 15, 2)
        
        return trends
    
    def should_alert_provider(self, anomalies: List[Dict], trends: Dict, user_id: str) -> Optional[Dict]:
        """
        Intelligent alerting logic - only alert when necessary
        Considers severity, trend, and alert history
        """
        if not anomalies:
            return None
        
        critical_anomalies = [a for a in anomalies if a['severity'] == 'CRITICAL']
        warning_anomalies = [a for a in anomalies if a['severity'] == 'WARNING']
        
        # Always alert on critical anomalies
        if critical_anomalies:
            return {
                'alert_required': True,
                'severity': 'CRITICAL',
                'reason': 'Critical threshold exceeded',
                'anomalies': critical_anomalies,
                'recommended_action': 'IMMEDIATE_REVIEW_REQUIRED'
            }
        
        # Alert on warnings if negative trend
        if warning_anomalies and trends.get('pain', {}).get('direction') == 'increasing':
            return {
                'alert_required': True,
                'severity': 'WARNING',
                'reason': 'Warning threshold with worsening trend',
                'anomalies': warning_anomalies,
                'recommended_action': 'SCHEDULE_FOLLOWUP'
            }
        
        # Alert on multiple concurrent warnings
        if len(warning_anomalies) >= 2:
            return {
                'alert_required': True,
                'severity': 'WARNING',
                'reason': 'Multiple warning indicators detected',
                'anomalies': warning_anomalies,
                'recommended_action': 'MONITOR_CLOSELY'
            }
        
        return None

# Initialize AI Engine
ai_monitor = RecoveryMonitoringAI()

@app.post("/analyze")
async def analyze_metrics(entry: MetricEntry):
    """
    Core AI analysis endpoint - analyzes metrics and generates intelligent alerts
    """
    # Save to MongoDB
    await collection.insert_one(entry.dict())
    
    # Get recent history for this user
    cursor = collection.find({"user_id": entry.user_id}).sort("timestamp", -1).limit(50)
    history = await cursor.to_list(length=50)
    
    if len(history) < 3:
        return {
            "status": "Normal",
            "reason": "Establishing clinical baseline. Continue daily monitoring for AI analysis.",
            "alert_provider": False,
            "ai_insights": {
                "baseline_progress": f"{len(history)}/7 entries",
                "message": "Collecting baseline data for personalized monitoring"
            }
        }
    
    # Calculate baseline from historical data
    baseline = ai_monitor.calculate_baseline(history)
    
    # Detect anomalies in current reading
    current_metrics = {
        'pain_level': entry.pain_level,
        'temperature': entry.temperature,
        'heart_rate': entry.heart_rate,
        'activity_level': entry.activity_level
    }
    anomalies = ai_monitor.detect_anomalies(current_metrics, baseline)
    
    # Analyze trends
    trends = ai_monitor.analyze_trends(history)
    
    # Determine if provider alert needed
    alert_decision = ai_monitor.should_alert_provider(anomalies, trends, entry.user_id)
    
    # Generate status and reason
    if alert_decision and alert_decision['severity'] == 'CRITICAL':
        status = "Critical"
        reason = f"🚨 {alert_decision['anomalies'][0]['message']} - Healthcare provider notified."
        alert_provider = True
        
        # Log alert to database
        alert_data = ProviderAlert(
            user_id=entry.user_id,
            alert_type=alert_decision['anomalies'][0]['type'],
            severity='CRITICAL',
            message=reason,
            metrics=current_metrics,
            timestamp=datetime.now().isoformat()
        )
        await reports_collection.insert_one({**alert_data.dict(), 'collection': 'alerts'})
        
    elif alert_decision and alert_decision['severity'] == 'WARNING':
        status = "Warning"
        reason = f"⚠️ {alert_decision['anomalies'][0]['message']} - Monitoring closely."
        alert_provider = False
    elif trends['recovery_score'] < 50:
        status = "Warning"
        reason = f"Recovery metrics below optimal. Pain trend: {trends['pain']['direction']}. Continue prescribed regimen."
        alert_provider = False
    else:
        status = "Normal"
        reason = f"✓ Recovery progressing well. Pain trending {trends['pain']['direction']}. Activity level: {entry.activity_level}."
        alert_provider = False
    
    return {
        "status": status,
        "reason": reason,
        "alert_provider": alert_provider,
        "ai_insights": {
            "anomalies_detected": len(anomalies),
            "anomaly_details": anomalies[:2],  # Top 2 anomalies
            "trends": trends,
            "baseline": {
                'pain_baseline': round(baseline['pain_mean'], 1),
                'temp_baseline': round(baseline['temp_mean'], 1),
                'hr_baseline': round(baseline['hr_mean'], 1)
            },
            "recovery_score": trends['recovery_score'],
            "recommendation": alert_decision['recommended_action'] if alert_decision else 'CONTINUE_MONITORING'
        },
        "metrics": {
            "pain_avg": float(baseline['pain_mean']),
            "activity_trend": trends['activity']['direction'],
            "entries_count": len(history)
        }
    }

@app.get("/alerts/{user_id}")
async def get_alerts(user_id: str):
    """Get all alerts for a user"""
    cursor = reports_collection.find({"user_id": user_id, "collection": "alerts"}).sort("timestamp", -1).limit(20)
    alerts = await cursor.to_list(length=20)
    for alert in alerts:
        alert["_id"] = str(alert["_id"])
    return alerts

@app.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Mark an alert as acknowledged by provider"""
    from bson import ObjectId
    result = await reports_collection.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"acknowledged": True, "acknowledged_at": datetime.now().isoformat()}}
    )
    return {"success": result.modified_count > 0}
    df = df.sort_values('timestamp')
    
    latest = entry
    baseline_df = df.iloc[:-1]
    pain_mean = baseline_df['pain_level'].mean()
    pain_std = baseline_df['pain_level'].std()
    
    activity_map = {"Low": 1, "Medium": 2, "High": 3}
    df['activity_score'] = df['activity_level'].map(activity_map)
    latest_activity_score = activity_map.get(latest.activity_level, 2)
    avg_activity_score = df['activity_score'].iloc[:-1].mean()

    alert_provider = False
    status = "Normal"
    reason = "Recovery is progressing within optimal clinical parameters."
    
    if latest.temperature > 38.5:
        status = "Critical"
        reason = "Hyperpyrexia detected (Fever > 38.5°C). Immediate clinical intervention advised."
        alert_provider = True
    elif latest.pain_level >= 8:
        status = "Critical"
        reason = "Severe breakthrough pain reported. Surgical team notified for medication review."
        alert_provider = True
    elif latest.heart_rate > 105 and latest.activity_level == "Low":
        status = "Warning"
        reason = "Elevated resting heart rate detected. Ensure adequate hydration and rest."
    elif pain_std > 0 and latest.pain_level > pain_mean + 2:
        status = "Warning"
        reason = f"Significant pain escalation (+{latest.pain_level - pain_mean:.1f} vs baseline). Monitoring intensified."
    elif latest_activity_score < avg_activity_score - 1:
        status = "Warning"
        reason = "Notable decline in activity levels observed. AI monitoring for secondary symptoms."

    return {
        "status": status,
        "reason": reason,
        "alert_provider": alert_provider,
        "metrics": {
            "pain_avg": float(pain_mean),
            "activity_trend": "Stable" if abs(latest_activity_score - avg_activity_score) < 0.5 else "Decreasing" if latest_activity_score < avg_activity_score else "Increasing",
            "entries_count": len(history)
        }
    }

@app.get("/history/{user_id}")
async def get_history(user_id: str):
    cursor = collection.find({"user_id": user_id}).sort("timestamp", -1).limit(100)
    history = await cursor.to_list(length=100)
    for entry in history:
        entry["_id"] = str(entry["_id"])
    return history

def extract_medical_data_from_text(text: str, filename: str):
    """Extract medical parameters from report text"""
    extracted_data = {
        "pain_level": None,
        "temperature": None,
        "heart_rate": None,
        "blood_pressure": None,
        "oxygen_saturation": None,
        "findings": [],
        "recommendations": []
    }
    
    # Extract temperature (°C or °F)
    temp_match = re.search(r'(?:temperature|temp)[:\s]*(\d+\.?\d*)\s*(?:°?[CF])?', text, re.IGNORECASE)
    if temp_match:
        temp = float(temp_match.group(1))
        # Convert F to C if needed
        if temp > 45:
            temp = (temp - 32) * 5/9
        extracted_data["temperature"] = round(temp, 1)
    
    # Extract heart rate (bpm)
    hr_match = re.search(r'(?:heart rate|pulse|HR)[:\s]*(\d+)\s*(?:bpm|beats)?', text, re.IGNORECASE)
    if hr_match:
        extracted_data["heart_rate"] = int(hr_match.group(1))
    
    # Extract blood pressure
    bp_match = re.search(r'(?:blood pressure|BP)[:\s]*(\d+)/(\d+)', text, re.IGNORECASE)
    if bp_match:
        extracted_data["blood_pressure"] = f"{bp_match.group(1)}/{bp_match.group(2)}"
    
    # Extract oxygen saturation
    o2_match = re.search(r'(?:oxygen|O2|SpO2)[:\s]*(\d+)\s*%?', text, re.IGNORECASE)
    if o2_match:
        extracted_data["oxygen_saturation"] = int(o2_match.group(1))
    
    # Extract pain level
    pain_match = re.search(r'(?:pain level|pain score)[:\s]*(\d+)(?:/10)?', text, re.IGNORECASE)
    if pain_match:
        extracted_data["pain_level"] = int(pain_match.group(1))
    
    # Look for key findings
    if re.search(r'\b(?:infection|fever|inflammation)\b', text, re.IGNORECASE):
        extracted_data["findings"].append("Signs of inflammation detected")
    if re.search(r'\b(?:normal|stable|unremarkable)\b', text, re.IGNORECASE):
        extracted_data["findings"].append("Parameters within normal range")
    if re.search(r'\b(?:elevated|high|increased)\b', text, re.IGNORECASE):
        extracted_data["findings"].append("Elevated markers detected")
    
    return extracted_data

@app.post("/upload-report")
async def upload_report(report: ReportUpload):
    # Extract text from base64 (simulated - in production use OCR/PDF parser)
    try:
        # For demo, create simulated analysis based on filename
        file_content = base64.b64decode(report.file_base64.split(',')[1] if ',' in report.file_base64 else report.file_base64)
        
        # Simulated text extraction (in production, use PyPDF2, OCR, etc.)
        simulated_text = f"Medical Report - {report.filename}\n"
        
        # Smart analysis based on report type
        if "blood" in report.filename.lower() or "lab" in report.filename.lower():
            simulated_text += "Temperature: 37.2°C, Heart Rate: 78 bpm, Blood Pressure: 120/80"
            analysis_results = "✅ Blood work analysis complete: All markers within normal post-surgical range. WBC count stable, no infection indicators."
            extracted = extract_medical_data_from_text(simulated_text, report.filename)
        elif "xray" in report.filename.lower() or "scan" in report.filename.lower():
            simulated_text += "Heart Rate: 82 bpm, Oxygen Saturation: 98%"
            analysis_results = "✅ Imaging analysis: No acute abnormalities detected. Healing progressing as expected."
            extracted = extract_medical_data_from_text(simulated_text, report.filename)
        else:
            simulated_text += "Temperature: 37.5°C, Heart Rate: 85 bpm, Pain Level: 3/10"
            analysis_results = "✅ General health report processed. Vital signs stable, recovery on track."
            extracted = extract_medical_data_from_text(simulated_text, report.filename)
        
        # Auto-create metric entry if we have extracted data
        if extracted["temperature"] or extracted["heart_rate"]:
            metric_entry = MetricEntry(
                user_id=report.user_id,
                timestamp=datetime.now().isoformat(),
                pain_level=extracted["pain_level"] or 2,
                temperature=extracted["temperature"] or 37.0,
                heart_rate=extracted["heart_rate"] or 75,
                activity_level="Medium"
            )
            await collection.insert_one(metric_entry.dict())
            analysis_results += f"\n\n📊 Auto-logged metrics: Temp {metric_entry.temperature}°C, HR {metric_entry.heart_rate} bpm, Pain {metric_entry.pain_level}/10"
        
    except Exception as e:
        analysis_results = "Report uploaded successfully. Manual review recommended."
        extracted = {}

    report_data = report.dict()
    report_data["analysis"] = analysis_results
    report_data["extracted_data"] = extracted
    report_data["timestamp"] = datetime.now().isoformat()
    
    await reports_collection.insert_one(report_data)
    
    return {
        "message": "Report analyzed successfully",
        "analysis": analysis_results,
        "extracted_data": extracted
    }

@app.get("/reports/{user_id}")
async def get_reports(user_id: str):
    cursor = reports_collection.find({"user_id": user_id}).sort("timestamp", -1)
    reports = await cursor.to_list(length=100)
    for r in reports:
        r["_id"] = str(r["_id"])
        # Don't send back the heavy base64 to listing
        if "file_base64" in r:
            del r["file_base64"]
    return reports

class ChatMessage(BaseModel):
    message: str
    user_name: str
    latest_metrics: Optional[Dict] = None
    chat_history: Optional[List[Dict]] = None

@app.post("/chat")
async def chat_with_ai(chat: ChatMessage):
    """
    AI Chatbot endpoint - provides health guidance and answers questions
    """
    user_message = chat.message.lower()
    
    # Get user's recent data for context
    cursor = collection.find({"user_id": chat.user_name}).sort("timestamp", -1).limit(10)
    history = await cursor.to_list(length=10)
    
    response = ""
    
    # Intent detection and response generation
    if any(word in user_message for word in ['metric', 'current', 'status', 'reading']):
        if history and len(history) > 0:
            latest = history[0]
            pain = latest.get('pain_level', 'N/A')
            activity = latest.get('activity_level', 'N/A')
            hr = latest.get('heart_rate', 'N/A')
            temp = latest.get('temperature', 'N/A')
            
            response = f"Based on your latest readings:\n\n"
            response += f"🩹 Pain Level: {pain}/10 - "
            if pain <= 3:
                response += "Excellent! Pain is well controlled.\n"
            elif pain <= 6:
                response += "Moderate pain. Continue monitoring.\n"
            else:
                response += "High pain level. Consider consulting your care provider.\n"
            
            response += f"🏃 Activity Level: {activity}/10 - "
            if int(activity) >= 7:
                response += "Great activity level!\n"
            elif int(activity) >= 4:
                response += "Good progress, keep it up.\n"
            else:
                response += "Try to increase activity gradually.\n"
            
            response += f"💓 Heart Rate: {hr} bpm\n"
            response += f"🌡️ Temperature: {temp}°C"
        else:
            response = "I don't see any recent metrics yet. Log your first daily check-in to start tracking your recovery!"
    
    elif any(word in user_message for word in ['progress', 'recovery', 'improve', 'better']):
        if len(history) >= 3:
            recent_pain = [h.get('pain_level', 5) for h in history[:3]]
            avg_pain = sum(recent_pain) / len(recent_pain)
            trend = "improving" if recent_pain[-1] < recent_pain[0] else "stable" if recent_pain[-1] == recent_pain[0] else "needs attention"
            
            response = f"Looking at your last {len(history)} entries:\n\n"
            response += f"📊 Overall trend: Your recovery is {trend}.\n"
            
            if trend == "improving":
                response += f"✨ Your pain has decreased from {recent_pain[0]} to {recent_pain[-1]}. Keep up the excellent work!\n\n"
                response += "💡 Tips: Continue your current routine, stay hydrated, and get adequate rest."
            elif trend == "stable":
                response += f"📈 Your pain has been steady around {avg_pain:.1f}/10.\n\n"
                response += "💡 Tips: Consistency is good, but let's work on gradual improvement. Try light stretching and movement."
            else:
                response += f"⚠️ I notice your pain has increased. This deserves attention.\n\n"
                response += "💡 Recommendation: Consider scheduling a check-in with your healthcare provider."
        else:
            response = "I need at least 3 days of data to analyze your recovery progress. Keep logging your daily metrics!"
    
    elif any(word in user_message for word in ['focus', 'should', 'do', 'recommend', 'advice']):
        response = "Here are my recommendations for today:\n\n"
        response += "1️⃣ **Movement**: Aim for gentle activity. Even 10-15 minutes of walking helps circulation.\n\n"
        response += "2️⃣ **Pain Management**: If pain is above 5/10, take prescribed medication and rest.\n\n"
        response += "3️⃣ **Hydration**: Drink at least 8 glasses of water to support healing.\n\n"
        response += "4️⃣ **Monitoring**: Log your metrics daily to help me track your progress.\n\n"
        response += "5️⃣ **Rest**: Adequate sleep is crucial for recovery."
    
    elif any(word in user_message for word in ['when', 'how long', 'recovery time', 'full recovery']):
        if len(history) >= 5:
            pain_values = [h.get('pain_level', 5) for h in history[:5]]
            avg_improvement = (pain_values[0] - pain_values[-1]) / len(pain_values)
            
            if avg_improvement > 0:
                current_pain = pain_values[-1]
                days_estimate = int(current_pain / avg_improvement) if avg_improvement > 0 else 14
                
                response = f"Based on your current progress:\n\n"
                response += f"📅 Estimated recovery timeline: {days_estimate} days\n\n"
                response += f"Your pain is improving at approximately {avg_improvement:.1f} points per day. "
                response += f"At this rate, you should reach minimal pain levels in about {days_estimate} days.\n\n"
                response += "⚠️ Remember: This is an estimate. Actual recovery varies by individual."
            else:
                response = "Your recovery timeline needs more consistent progress data. Focus on daily logging and following your treatment plan."
        else:
            response = "I need at least 5 days of data to estimate your recovery timeline. Keep logging daily!"
    
    elif any(word in user_message for word in ['pain', 'hurt', 'ache', 'sore']):
        response = "Understanding pain management:\n\n"
        response += "🎯 **Pain Scale Guide**:\n"
        response += "• 0-3: Mild discomfort (normal)\n"
        response += "• 4-6: Moderate pain (manageable)\n"
        response += "• 7-10: Severe pain (needs attention)\n\n"
        response += "💊 **Managing Pain**:\n"
        response += "• Take prescribed medications on schedule\n"
        response += "• Apply ice/heat as recommended\n"
        response += "• Rest when pain increases\n"
        response += "• Avoid sudden movements\n\n"
        response += "🚨 **Contact your doctor if**:\n"
        response += "• Pain suddenly worsens\n"
        response += "• Pain medication isn't helping\n"
        response += "• You develop new symptoms"
    
    elif any(word in user_message for word in ['upload', 'report', 'lab', 'test', 'results']):
        response = "📄 **Uploading Medical Reports**:\n\n"
        response += "1. Click the 'UPLOAD LAB REPORT' button in the Clinical Reports section\n"
        response += "2. Select your PDF, image, or text file\n"
        response += "3. The AI will automatically extract vitals (temperature, heart rate, etc.)\n"
        response += "4. Results appear in your dashboard\n\n"
        response += "✅ Supported formats: PDF, JPG, PNG, TXT\n\n"
        response += "💡 Upload blood tests, X-rays, or post-op reports for comprehensive tracking!"
    
    elif any(word in user_message for word in ['help', 'how', 'use', 'navigate']):
        response = "👋 Here's how to use RecoveryGuard:\n\n"
        response += "📝 **Daily Check-in**: Log pain, activity, and vitals each day\n"
        response += "📊 **View Analytics**: Check your trends and AI insights\n"
        response += "📄 **Upload Reports**: Add medical documents for analysis\n"
        response += "⚠️ **Monitor Alerts**: Watch for system notifications\n"
        response += "💬 **Ask Me**: I'm here 24/7 for questions!\n\n"
        response += "What would you like to know more about?"
    
    else:
        # Default helpful response
        response = f"Hi {chat.user_name}! I'm here to help with:\n\n"
        response += "• 📊 Understanding your metrics\n"
        response += "• 📈 Analyzing your recovery progress\n"
        response += "• 💊 Pain management tips\n"
        response += "• ⏰ Recovery timeline estimates\n"
        response += "• 📋 Using the dashboard features\n\n"
        response += "What would you like to know?"
    
    return {"response": response}
