import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import random

MONGO_URL = "mongodb+srv://rasikashreekruu:Rasika1526@cluster0.ilf1wwc.mongodb.net/"
client = AsyncIOMotorClient(MONGO_URL)
db = client.recovery_db
collection = db.metrics

async def generate_mock_data():
    print("Generating clinical mock data for user 'ashmi'...")
    # Clear existing data for ashmi
    await collection.delete_many({"user_id": "ashmi"})
    
    base_time = datetime.now() - timedelta(days=10)
    entries = []
    
    # Generate 10 days of recovery data
    base_pain = 8
    base_activity = 3
    
    for i in range(10):
        time_point = base_time + timedelta(days=i)
        timestamp = time_point.isoformat()
        
        # Simulate recovery: pain decreases, activity increases
        pain = max(2, base_pain - (i * 0.6))
        activity = min(9, base_activity + (i * 0.6))
        hr = 85 - (i * 1.5)
        temp = 37.5 - (i * 0.05)
        
        entry = {
            "user_id": "ashmi",
            "timestamp": timestamp,
            "pain_level": int(pain),
            "temperature": round(temp, 1),
            "heart_rate": int(hr),
            "activity_level": str(int(activity))
        }
        entries.append(entry)
        print(f"Day {i+1}: Pain={int(pain)}, Activity={int(activity)}, HR={int(hr)}, Temp={round(temp,1)}")
    
    await collection.insert_many(entries)
    print(f"\n✓ Successfully inserted {len(entries)} entries for user 'ashmi'")

if __name__ == "__main__":
    asyncio.run(generate_mock_data())
