# Screenshot Guide

This guide will help you capture screenshots for the README.md file.

## Required Screenshots

### 1. Dashboard Overview (`dashboard.png`)
- **What to capture**: Full dashboard view after login
- **Steps**:
  1. Login with ashmi/password123
  2. Wait for all components to load
  3. Capture full browser window showing:
     - Header with user name and health score
     - Clinical status card
     - Daily check-in form or report analysis
     - Clinical monitor with vitals
     - File upload section
  4. Save as <img width="1854" height="670" alt="image" src="https://github.com/user-attachments/assets/3051a602-ca6c-4012-a3e3-0de712c52d4d" />


### 2. Predictive Analytics (`predictive-analytics.png`)
- **What to capture**: The Predictive Analytics component
- **Steps**:
  1. Scroll to the "Recovery Trajectory Analysis" section
  2. Ensure all three metrics are visible:
     - Recovery Velocity
     - Complication Risk
     - Recovery Index
  3. Include the 7-Day Pain Forecast chart
  4. Save as <img width="1846" height="573" alt="image" src="https://github.com/user-attachments/assets/ccfe0ebf-3a79-49ef-8c11-99f01d05ab7b" />
`

### 3. Clinical Monitor (`clinical-monitor.png`)
- **What to capture**: The Clinical Status card
- **Steps**:
  1. Focus on the "Clinical Status" component
  2. Show:
     - Real-time vitals (Pain, HR, Activity)
     - Next milestone progress bar
     - Active monitoring alerts
     - System status footer
  3. Save as <img width="1803" height="853" alt="image" src="https://github.com/user-attachments/assets/f56c49ea-9cf7-4efb-a724-43e114fe2dca" />


### 4. Health Forecast (`health-forecast.png`)
- **What to capture**: Recovery Forecast component
- **Steps**:
  1. Locate the "Recovery Forecast" section
  2. Ensure visible:
     - Milestone tracker (Pain Management, Mobility, Full Recovery)
     - Days until full recovery
     - Predictions for tomorrow and next week
  3. Save as <img width="861" height="809" alt="image" src="https://github.com/user-attachments/assets/2dce21b7-9ad6-4a9f-87a7-559158b836da" />


### 5. Risk Assessment (`risk-assessment.png`)
- **What to capture**: Risk Assessment component
- **Steps**:
  1. Find the "Real-Time Risk Assessment" section
  2. Show:
     - Risk score gauge (0-100)
     - Risk factors list
     - Protective factors
  3. Save as <img width="784" height="742" alt="image" src="https://github.com/user-attachments/assets/261362c3-19e6-4b4c-86c7-b28ef6f98e45" />


### 6. Medical Report Upload (`report-upload.png`)
- **What to capture**: Clinical Reports section
- **Steps**:
  1. Focus on the dark "Clinical Reports" card
  2. Show:
     - List of uploaded reports
     - "UPLOAD LAB REPORT" button
     - Report count in header
  3. Optionally: Show the upload in action or result
  4. Save as <img width="430" height="636" alt="image" src="https://github.com/user-attachments/assets/ffe587ae-8727-4950-b98e-8fbc08fe6772" />


## Screenshot Tips

### Best Practices
- Use 1920x1080 resolution or higher
- Ensure good contrast and readability
- Capture during daylight/bright mode for clarity
- Remove any sensitive personal information
- Use browser zoom at 100% for consistency

### Tools
- **Windows**: Snipping Tool (Win + Shift + S)
- **Browser DevTools**: Device toolbar for consistent sizing
- **Full Page**: Browser extensions for scrolling screenshots

### Editing (Optional)
- Crop to show only relevant content
- Add borders or shadows for GitHub display
- Annotate key features with arrows/highlights
- Optimize file size (compress to < 500KB each)

## After Capturing Screenshots

1. Save all images in the `screenshots/` directory
2. Verify filenames match those in README.md:
   - dashboard.png
   - predictive-analytics.png
   - clinical-monitor.png
   - health-forecast.png
   - risk-assessment.png
   - report-upload.png
3. Commit to git:
   ```bash
   git add screenshots/
   git commit -m "Add application screenshots"
   git push
   ```

## Alternative: Use Placeholder Images

If screenshots are not immediately available, you can use placeholder services:
- https://via.placeholder.com/1200x800/14b8a6/ffffff?text=Dashboard
- Replace URLs in README.md temporarily

---

**Note**: Screenshots should showcase the application's features and user interface clearly for potential users and contributors viewing the GitHub repository.
