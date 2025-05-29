# 🚀 SecureVision Quick Start Guide

## **⏱️ 5-Minute Setup**

### **Prerequisites**
- Google account
- Node.js 18+ installed
- Basic terminal/command line knowledge

---

## **Step 1: Google Sheets Setup (2 minutes)**

### **1.1 Create Spreadsheet**
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new blank spreadsheet
3. Name it "SecureVision Data"

### **1.2 Create Required Sheets**
Add these 5 sheets (rename Sheet1 to Incidents, then add 4 more):
- **Incidents**
- **Sites** 
- **Officers**
- **Categories**
- **Shifts**

### **1.3 Add Headers**
Copy headers from `google-sheets/Sheet-Headers.txt` to each sheet

### **1.4 Copy Sheet ID**
From URL: `https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit`

---

## **Step 2: Apps Script Setup (1 minute)**

### **2.1 Create Script**
1. In your sheet: **Extensions** → **Apps Script**
2. Delete default code
3. Paste code from `google-sheets/Apps-Script-Template.js`
4. Update `SHEET_ID` with your Sheet ID from Step 1.4

### **2.2 Deploy**
1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Access: **Anyone**
5. **Copy the web app URL**

---

## **Step 3: SecureVision Setup (2 minutes)**

### **3.1 Install & Run**
```bash
# Clone or extract SecureVision
cd securevision

# Install dependencies
npm install

# Start app
npm run dev
```

### **3.2 Complete Setup Wizard**
1. Open `http://localhost:3000`
2. Complete 5-step wizard:
   - **Step 1**: Welcome (click Start)
   - **Step 2**: Paste Sheet ID and Apps Script URL
   - **Step 3**: Enter company name, upload logo
   - **Step 4**: Skip deployment for now
   - **Step 5**: Note the QR code (works after deployment)

---

## **Step 4: Deploy (Choose One)**

### **Option A: Vercel (Easiest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, get URL like: https://your-app.vercel.app
```

### **Option B: Netlify**
```bash
# Build static version
EXPORT_MODE=true npm run build
npm run export

# Upload 'out' folder to netlify.com
```

### **Option C: GitHub Pages**
```bash
# Push to GitHub, enable Pages in repo settings
git add .
git commit -m "Deploy SecureVision"
git push
```

---

## **🎉 You're Done!**

### **Test Everything:**
1. **Admin**: Go to `/admin`, add a site and officer
2. **Mobile**: Go to `/incidents/report`, submit test incident  
3. **Data**: Check your Google Sheet - data should appear
4. **QR Code**: Scan QR from setup wizard with phone

### **What You Have:**
- ✅ Professional incident management system
- ✅ Mobile QR code reporting
- ✅ Real-time Google Sheets integration
- ✅ Custom branding
- ✅ Admin dashboard

### **Next Steps:**
- Print QR codes for staff
- Train team on incident reporting
- Customize categories and sites
- Set up regular data reviews

### **Need Help?**
- 📧 Email: support@securevision-system.com
- 📚 Full docs: `/docs` folder
- 🐛 Issues: Create GitHub issue

**Total setup time: ~5 minutes!** 🚀
