# Sample Medical Reports for Testing

This folder contains sample medical reports for testing the VitalSentinel report upload and analysis feature.

## Available Reports

### 1. Blood Test Report (`blood_test_report.txt`)
- **Contains:** Complete blood count, metabolic panel, inflammatory markers
- **Key Metrics:** Temperature 37.2°C, HR 78 bpm, Pain 2/10
- **Status:** All normal values
- **Use Case:** Testing lab report analysis and normal value extraction

### 2. X-Ray Scan Report (`xray_scan_report.txt`)
- **Contains:** Chest X-ray findings, imaging results
- **Key Metrics:** Temperature 36.8°C, HR 82 bpm, SpO2 98%, Pain 3/10
- **Status:** No abnormalities detected
- **Use Case:** Testing radiology report analysis

### 3. Post-Surgery Checkup (`post_surgery_checkup.txt`)
- **Contains:** Comprehensive post-operative assessment
- **Key Metrics:** Temperature 37.5°C, HR 85 bpm, Pain 3/10, Activity Level: Medium
- **Status:** Excellent recovery progress
- **Use Case:** Testing comprehensive clinical report parsing

## How to Use

1. **In the Application:**
   - Login to VitalSentinel
   - Navigate to the "Clinical Reports" card (dark card with phone icon)
   - Click "UPLOAD LAB REPORT"
   - Select one of these .txt files
   - The system will automatically extract and analyze the data

2. **Expected Behavior:**
   - System extracts vital signs (temperature, heart rate, etc.)
   - Auto-populates dashboard with new metrics
   - Generates AI analysis summary
   - Displays report in the reports list

3. **What Gets Extracted:**
   - Temperature (°C/°F)
   - Heart Rate (bpm)
   - Blood Pressure
   - Oxygen Saturation
   - Pain Level
   - Key medical findings

## Testing Scenarios

### Scenario 1: Normal Values
Upload `blood_test_report.txt` - Should show:
- Status: Normal
- All parameters within range
- No alerts triggered

### Scenario 2: Imaging Analysis
Upload `xray_scan_report.txt` - Should show:
- Clear imaging results
- No complications detected
- Recovery on track

### Scenario 3: Comprehensive Assessment
Upload `post_surgery_checkup.txt` - Should show:
- Activity level: Medium
- Pain level: 3/10
- Recovery progressing well

## File Format Support

The system accepts:
- `.txt` - Plain text medical reports
- `.pdf` - PDF documents (future enhancement)
- `.jpg/.jpeg/.png` - Scanned reports (future enhancement)

## Training the Model

To enhance the extraction algorithm:

1. **Add more patterns** in `backend/main.py` > `extract_medical_data_from_text()`
2. **Test with variations** of medical terminology
3. **Handle edge cases** like different date formats, units, etc.

## Notes

- These are simulated reports for testing only
- Contains realistic but fictional medical data
- Designed to trigger different analysis paths
- All patient information is sample data
