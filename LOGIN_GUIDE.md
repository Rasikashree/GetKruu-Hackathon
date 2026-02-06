# Login & System Verification

## ✅ Backend Status
- ✓ API Running on http://localhost:8000
- ✓ Login endpoint responding
- ✓ User "ashmi" exists with password "password123"
- ✓ All endpoints configured correctly

## 📱 How to Login

### Step 1: Ensure Backend is Running
```powershell
# Open PowerShell and run:
cd "D:\Kruu Hackathon"
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Wait until you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Open Frontend
Go to: **http://localhost:5174**

### Step 3: Login with Test Account
- **Username:** ashmi
- **Password:** password123

Click "LOGIN"

---

## 🔧 If Login Still Doesn't Work

### Issue 1: Backend Not Running
Check if port 8000 is in use:
```powershell
netstat -ano | findstr :8000
```

If stuck, kill and restart:
```powershell
taskkill /F /IM python.exe
Start-Sleep -Seconds 2
cd "D:\Kruu Hackathon"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Issue 2: Frontend CORS Issues
Frontend should connect to `http://localhost:8000` (already configured)

### Issue 3: MongoDB Connection
Backend has MongoDB pre-configured with cloud database
- No local setup needed
- Uses existing "ashmi" account

---

## ✅ Quick Verification Commands

### Test Backend
```powershell
# In PowerShell, test if backend is working:
$body = '{"username":"ashmi","password":"password123"}'
Invoke-WebRequest -Uri "http://localhost:8000/login" -Method POST `
  -ContentType "application/json" -Body $body -UseBasicParsing
```

Expected response:
```json
{"username":"ashmi","full_name":"Ashmitha B","message":"Login successful"}
```

### Test Frontend
Go to: http://localhost:5174

Should see login page with:
- VITAL SENTINEL logo
- Username field
- Password field
- LOGIN button

---

## 📋 Complete Working Setup

| Component | Status | URL |
|-----------|--------|-----|
| Backend API | ✅ Running | http://localhost:8000 |
| Frontend UI | ✅ Running | http://localhost:5174 |
| Database | ✅ Connected | MongoDB Atlas Cloud |
| Test User | ✅ Created | ashmi / password123 |
| API Docs | ✅ Available | http://localhost:8000/docs |

---

## 🎯 Next Steps After Login

1. You'll see the main dashboard
2. See "Daily Check-in" form
3. Upload medical reports
4. View AI insights
5. Check recovery trends

Everything is fully functional! 🚀
