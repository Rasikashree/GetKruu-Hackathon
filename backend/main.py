from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import json

app = FastAPI()

# MongoDB Connection
MONGO_URL = "mongodb+srv://rasikashreekruu:Rasika1526@cluster0.ilf1wwc.mongodb.net/"
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

@app.post("/analyze")
async def analyze_metrics(entry: MetricEntry):
    # Save to MongoDB
    await collection.insert_one(entry.dict())
    
    # Get recent history for trend analysis for THIS user
    cursor = collection.find({"user_id": entry.user_id}).sort("timestamp", -1).limit(50)
    history = await cursor.to_list(length=50)
    
    if len(history) < 3:
        return {
            "status": "Normal",
            "reason": "Acquiring clinical baseline. Please continue monitoring.",
            "alert_provider": False
        }
    
    # ... (keep rest of logic same)
    df = pd.DataFrame(history)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
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

@app.post("/upload-report")
async def upload_report(report: ReportUpload):
    # AI Analysis Simulation
    analysis_results = "Report Analysis Complete: Vital parameters are consistent with post-operative recovery patterns. No acute markers of inflammation or secondary complications identified."
    
    if "blood" in report.filename.lower() or "lab" in report.filename.lower():
        analysis_results = "Clinical AI Analysis: White blood cell count and inflammatory markers (CRP) are within normal post-surgical range. Hemoglobin levels indicate stable oxygen-carrying capacity."

    report_data = report.dict()
    report_data["analysis"] = analysis_results
    report_data["timestamp"] = datetime.now().isoformat()
    
    await reports_collection.insert_one(report_data)
    
    return {
        "message": "Report analyzed successfully",
        "analysis": analysis_results
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
