# 🚀 BackPain Manager Pro - First Time Setup

## **Quick Start Commands**

### **For Termux (Android):**
```bash
# 1. Update Termux
pkg update && pkg upgrade -y

# 2. Install required packages
pkg install git nodejs npm -y

# 3. Clone your app
git clone https://github.com/bullsbears682/backpain-manager-pro.git

# 4. Enter the directory
cd backpain-manager-pro

# 5. Install dependencies (this may take 5-10 minutes)
npm install

# 6. Start the app
npm start

# 7. Open browser and go to: http://localhost:3000
```

### **For Regular Computer (Windows/Mac/Linux):**
```bash
# 1. Clone your app
git clone https://github.com/bullsbears682/backpain-manager-pro.git

# 2. Enter the directory
cd backpain-manager-pro

# 3. Install dependencies
npm install

# 4. Start the app
npm start

# 5. Open browser and go to: http://localhost:3000
```

## **Step-by-Step Detailed Instructions**

### **🔧 Prerequisites Check**

Before starting, make sure you have:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning)

#### **Check if you have these installed:**
```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
git --version     # Should show git version
```

### **📱 Termux Specific Setup**

1. **Open Termux app**
2. **Update packages:**
   ```bash
   pkg update && pkg upgrade
   ```
3. **Install Node.js, npm, and Git:**
   ```bash
   pkg install git nodejs npm
   ```
4. **Grant storage permission (optional but recommended):**
   ```bash
   termux-setup-storage
   ```

### **💻 Download and Setup**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bullsbears682/backpain-manager-pro.git
   ```

2. **Navigate to the project:**
   ```bash
   cd backpain-manager-pro
   ```

3. **Install all dependencies:**
   ```bash
   npm install
   ```
   ⏰ *This step takes 5-10 minutes depending on your internet speed*

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Access your app:**
   - Open any browser
   - Go to: `http://localhost:3000`
   - Your BackPain Manager Pro will load!

## **🎯 What Happens on First Run**

When you first open the app:

1. **Initial Loading Screen** - The app initializes
2. **Default Data Creation** - Sample data is created for demonstration
3. **Dashboard Loads** - You'll see the main dashboard with:
   - Pain level overview
   - Recent entries
   - Quick action buttons
   - Navigation sidebar

## **📊 Exploring Your App**

Your BackPain Manager Pro includes:

- **Dashboard** - Overview of all your health data
- **Pain Tracking** - Log and track pain levels
- **Exercises** - 20+ exercise routines with videos
- **Appointments** - Schedule and manage appointments
- **Medications** - Track medications and schedules
- **Education** - Health articles and learning materials
- **Reports** - Generate PDF reports of your data
- **Settings** - Customize the app to your needs

## **🔧 Troubleshooting First Run Issues**

### **If npm install fails:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### **If port 3000 is busy:**
```bash
# Kill any process using port 3000
npx kill-port 3000

# Or start on a different port
npm start -- --port 3001
```

### **For Termux storage issues:**
```bash
# Grant storage permissions
termux-setup-storage

# Change to shared storage
cd /storage/emulated/0
git clone https://github.com/bullsbears682/backpain-manager-pro.git
```

### **If the browser doesn't open automatically:**
- Manually open your browser
- Type: `http://localhost:3000`
- Bookmark this URL for easy access

## **🎉 Success Indicators**

You'll know it's working when you see:
- ✅ `Compiled successfully!`
- ✅ `Local: http://localhost:3000`
- ✅ Browser opens automatically
- ✅ BackPain Manager Pro dashboard loads

## **🚀 Next Steps**

1. **Explore the demo data** - The app comes with sample entries
2. **Clear demo data** - Go to Settings > Data Management > Clear All Data
3. **Start tracking** - Begin adding your own pain entries
4. **Customize settings** - Set up notifications and preferences
5. **Generate reports** - Create your first PDF report

## **💡 Pro Tips**

- **Bookmark** `http://localhost:3000` for quick access
- **Keep Termux running** in background to maintain the server
- **Use split screen** on Android to run Termux + Browser simultaneously
- **Enable notifications** in Settings for medication reminders
- **Export data regularly** using the Settings > Data Management feature

## **🆘 Need Help?**

If you encounter any issues:

1. Check the terminal for error messages
2. Restart the server: `Ctrl+C` then `npm start`
3. Clear browser cache and reload
4. Reinstall dependencies: `rm -rf node_modules && npm install`

---

**🏥 Congratulations! You now have a professional $30,000+ healthcare application running on your device!**