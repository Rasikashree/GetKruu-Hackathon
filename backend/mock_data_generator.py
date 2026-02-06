import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import random

MONGO_URL = "mongodb+srv://rasikashreekruu:Rasika1526@cluster0.ilf1wwc.mongodb.net/"
client = AsyncIOMotorClient(MONGO_URL)
db = client.recovery_db
collection = db.metrics

async def generate_mock_data():
    print("Generating clinical mock data...")
    # Clear existing data for a fresh start
    await collection.delete_many({})
    
    base_time = datetime.now() - timedelta(days=2)
    entries = []
    
    # Generate 48 hours of data (one entry every 4 hours)
    for i in range(12):
        time_point = base_time + timedelta(hours=i*4)
        timestamp = time_point.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
        
        # Simulate a normal recovery trend
        entry = {
            "timestamp": timestamp,
            "pain_level": max(2, 6 - (i // 2)), # Pain decreasing over time
            "temperature": round(random.uniform(36.6, 37.2), 1),
            "heart_rate": random.randint(70, 85),
            "activity_level": "Medium" if i > 6 else "Low"
        }
        entries.append(entry)
    
    await collection.insert_many(entries)
    print(f"Successfully injected {len(entries)} clinical data points into MongoDB.")

if __name__ == "__main__":
    asyncio.run(generate_mock_data())
