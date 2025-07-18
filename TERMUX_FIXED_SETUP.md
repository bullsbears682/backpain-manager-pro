# 🔧 TERMUX SETUP - FIXED VERSION

## 🚨 **CORRECTED Commands for Termux**

### **Step 1: Install Packages (CORRECTED)**
```bash
# Update Termux first
pkg update && pkg upgrade -y

# Install git and nodejs (npm comes with nodejs automatically)
pkg install git nodejs -y

# Verify installations
node --version
npm --version
git --version
```

### **Step 2: Clone Repository (FIXED)**

**Option A: Use GitHub CLI (Recommended)**
```bash
# Install GitHub CLI
pkg install gh

# Login to GitHub (this will open browser)
gh auth login

# Clone using GitHub CLI
gh repo clone bullsbears682/backpain-manager-pro
```

**Option B: Download as ZIP (Alternative)**
```bash
# Download and extract ZIP file
pkg install wget unzip
wget https://github.com/bullsbears682/backpain-manager-pro/archive/refs/heads/main.zip
unzip main.zip
mv backpain-manager-pro-main backpain-manager-pro
```

**Option C: Use Personal Access Token**
```bash
# If you have a GitHub Personal Access Token
git clone https://YOUR_TOKEN@github.com/bullsbears682/backpain-manager-pro.git
```

### **Step 3: Setup and Run**
```bash
# Navigate to the project
cd backpain-manager-pro

# Install dependencies
npm install

# Start the application
npm start
```

### **Step 4: Access Your App**
- Open any browser on your Android device
- Go to: `http://localhost:3000`
- Your BackPain Manager Pro will load!

## 🔧 **Alternative: Direct Download Method**

If git clone still doesn't work, use this method:

```bash
# Method 1: Direct download
pkg install curl unzip
curl -L https://github.com/bullsbears682/backpain-manager-pro/archive/refs/heads/main.zip -o backpain.zip
unzip backpain.zip
mv backpain-manager-pro-main backpain-manager-pro
cd backpain-manager-pro
npm install
npm start
```

## 🆘 **Troubleshooting**

### **If npm is not found:**
```bash
# Reinstall nodejs
pkg uninstall nodejs
pkg install nodejs
```

### **If git clone asks for password:**
- Use Option B (ZIP download) above
- Or set up SSH keys
- Or use GitHub CLI (Option A)

### **If npm install fails:**
```bash
# Clear cache and try again
npm cache clean --force
npm install --legacy-peer-deps
```

### **If port 3000 is busy:**
```bash
# Use different port
npm start -- --port 3001
# Then access: http://localhost:3001
```

## ✅ **Success Checklist**

You'll know it's working when:
- ✅ `node --version` shows v16+ 
- ✅ `npm --version` shows 8+
- ✅ `cd backpain-manager-pro` works
- ✅ `npm start` shows "Compiled successfully!"
- ✅ Browser loads the app at `http://localhost:3000`

## 🎯 **Quick Test Commands**

```bash
# Test if everything is installed correctly
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Git version: $(git --version)"

# Check if project exists
ls -la backpain-manager-pro/

# Check if package.json exists
cat backpain-manager-pro/package.json | head -10
```

---

**🏥 Once running, you'll have a complete professional healthcare application on your Android device!**