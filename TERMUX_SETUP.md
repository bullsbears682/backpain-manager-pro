# BackPain Manager Pro - Termux Setup Guide

## 🚀 Quick Setup for Termux

Follow these steps to get the BackPain Manager Pro running on your Android device using Termux.

### Step 1: Install Required Packages

```bash
# Update package list
pkg update && pkg upgrade

# Install essential packages
pkg install git nodejs npm

# Verify installations
node --version
npm --version
git --version
```

### Step 2: Clone the Repository

```bash
# Clone the BackPain Manager Pro repository
git clone [REPOSITORY_URL_WILL_BE_PROVIDED]

# Navigate to the project directory
cd backpain-manager-pro

# Install dependencies
npm install
```

### Step 3: Run the Application

```bash
# Start the development server
npm start

# The app will be available at:
# http://localhost:3000
```

### Step 4: Access the Application

1. **Option A - Same Device:**
   - Open your browser and go to `http://localhost:3000`

2. **Option B - Other Devices on Same Network:**
   - Find your device's IP address: `ifconfig`
   - Access from other devices: `http://[YOUR_IP]:3000`

## 📱 Termux-Specific Notes

### Storage Access
```bash
# Allow Termux to access device storage
termux-setup-storage
```

### Background Running
```bash
# To keep the server running in background
nohup npm start &

# To stop background process
pkill -f webpack
```

### Memory Management
```bash
# If you encounter memory issues
export NODE_OPTIONS="--max-old-space-size=2048"
npm start
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill existing process
   pkill -f webpack
   # Or use different port
   npm start -- --port 3001
   ```

2. **Permission Errors:**
   ```bash
   # Fix npm permissions
   npm config set prefix ~/.local
   export PATH=~/.local/bin:$PATH
   ```

3. **Memory Issues:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reduce memory usage
   export NODE_OPTIONS="--max-old-space-size=1024"
   ```

## 📋 Commands Reference

### Development Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Development server with custom port
npm start -- --port 3001

# Development server accessible from network
npm start -- --host 0.0.0.0
```

### Data Management
```bash
# Export app data (from within the app)
# Go to Settings > Data Management > Export Data

# Import app data (from within the app)
# Go to Settings > Data Management > Import Data
```

## 🌐 Network Access

### Access from Other Devices

1. **Start server with network access:**
   ```bash
   npm start -- --host 0.0.0.0
   ```

2. **Find your IP address:**
   ```bash
   ifconfig wlan0
   # Look for inet address
   ```

3. **Access from other devices:**
   - Use `http://[YOUR_IP]:3000`
   - Example: `http://192.168.1.100:3000`

## 💾 Data Persistence

The app stores all data locally in your browser's localStorage:
- Pain tracking entries
- Medication schedules
- Appointment information
- Exercise progress
- Settings and preferences

**Important:** Data is tied to the browser and domain. If you clear browser data, you'll lose your information unless you export it first.

## 🔒 Privacy & Security

- ✅ All data stored locally on your device
- ✅ No internet connection required for functionality
- ✅ No data sent to external servers
- ✅ Complete privacy and data ownership
- ✅ Export/import for backup purposes

## 📊 Performance Tips

### Optimize for Mobile
```bash
# For better performance on mobile
export NODE_OPTIONS="--max-old-space-size=1024"
```

### Reduce Resource Usage
```bash
# Use production build for better performance
npm run build
# Then serve the dist folder with a simple server
npx serve dist
```

## 🆘 Support

### If You Need Help

1. **Check the built-in help:**
   - Go to Settings > Help & Support in the app

2. **Common solutions:**
   - Restart Termux
   - Clear npm cache: `npm cache clean --force`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Reset everything:**
   ```bash
   # Complete reset
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📱 Mobile Browser Tips

### Best Browsers for the App
- **Chrome Mobile** - Best performance
- **Firefox Mobile** - Good compatibility
- **Samsung Internet** - Good performance on Samsung devices

### Mobile Optimization
- The app is fully responsive and works great on mobile
- Use landscape mode for better dashboard viewing
- Enable "Desktop site" if you prefer the full layout

## 🎯 Quick Start Checklist

- [ ] Install Termux
- [ ] Run: `pkg update && pkg upgrade`
- [ ] Run: `pkg install git nodejs npm`
- [ ] Clone the repository
- [ ] Run: `npm install`
- [ ] Run: `npm start`
- [ ] Access `http://localhost:3000`
- [ ] Start tracking your back pain!

## 🏥 Using the App

Once running, you can:
1. **Track daily pain levels** with detailed logging
2. **Follow exercise routines** with built-in timers
3. **Manage medications** with schedule tracking
4. **Schedule appointments** with provider information
5. **Generate reports** for healthcare providers
6. **Learn about back pain** with educational content
7. **Export your data** for backup or sharing

The app works completely offline and maintains all your data locally for privacy and security.

---

**BackPain Manager Pro** - Professional pain management in your pocket! 🏥📱