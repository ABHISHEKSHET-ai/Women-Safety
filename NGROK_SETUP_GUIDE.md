# 🚀 Quick Start Guide - Share Your App Globally

## ✅ ngrok is Already Installed!

I've set everything up for you. Just follow these 3 simple steps:

---

## 📋 **Step 1: Get Your Free ngrok Token**

1. **Open this link:** https://dashboard.ngrok.com/signup
   - Sign up with Google/GitHub or email (it's FREE!)

2. **After login, copy your auth token from:**
   https://dashboard.ngrok.com/get-started/your-authtoken
   
   It looks like: `2abc123def456gh789...`

---

## 📋 **Step 2: Run the Setup Script**

1. **Double-click this file:**
   ```
   d:\womensafetyq\womensafetyq\start-ngrok.bat
   ```

2. **When asked, paste your token** (right-click to paste in terminal)

3. **Press Enter**

---

## 📋 **Step 3: Get Your Public URL**

After starting ngrok, you'll see something like:

```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.3.1
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:8080
```

**Your public URL is the "Forwarding" line!**

Example: `https://abc123xyz.ngrok-free.app`

---

## 🌍 **Share Your App**

**Send this link to anyone:**
```
https://YOUR-UNIQUE-ID.ngrok-free.app
```

They can access it from:
- ✅ Any phone (iPhone, Android)
- ✅ Any computer
- ✅ Any network
- ✅ Anywhere in the world!

---

## 📱 **How to Use:**

1. **Keep your computer running** (with Spring Boot server)
2. **Keep ngrok running** (don't close the terminal)
3. **Share the ngrok URL** with your users
4. **That's it!** They can access your app from anywhere!

---

## ⚠️ **Important Notes:**

- ✅ **Free tier** includes everything you need for testing
- ⚠️ **URL changes** each time you restart ngrok
- ⚠️ **Keep both terminals open:**
  - Terminal 1: Spring Boot server (port 8080)
  - Terminal 2: ngrok tunnel

---

## 🔄 **To Restart:**

1. **Close ngrok** (Ctrl+C in ngrok terminal)
2. **Run again:** Double-click `start-ngrok.bat`
3. **New URL will be generated** (share the new one)

---

## 🆘 **Troubleshooting:**

### **Problem: "Command not found: ngrok"**
- **Solution:** Restart your PowerShell/Command Prompt
- Or run: `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")`

### **Problem: "Invalid credentials"**
- **Solution:** Make sure you copied the full token from ngrok dashboard

### **Problem: "Failed to connect"**
- **Solution:** Make sure Spring Boot server is running on port 8080 first!

---

## 💡 **Pro Tips:**

1. **Want a permanent URL?**
   - Upgrade to ngrok paid plan ($8/month)
   - Get custom domain like: `https://womensafety.ngrok.app`

2. **Monitor traffic:**
   - Open: http://127.0.0.1:4040
   - See all requests in real-time!

3. **Keep it running:**
   - ngrok stays active as long as terminal is open
   - Minimize the window, don't close it

---

## ✅ **Quick Checklist:**

- [ ] Spring Boot server running (port 8080)
- [ ] ngrok account created (free)
- [ ] Auth token copied
- [ ] start-ngrok.bat executed
- [ ] Public URL copied from terminal
- [ ] URL shared with users
- [ ] Both terminals kept open

---

## 🎯 **Ready to Start?**

1. **First, make sure Spring Boot is running:**
   - Open PowerShell in: `d:\womensafetyq\womensafetyq`
   - Run: `.\mvnw.cmd spring-boot:run`

2. **Then start ngrok:**
   - Double-click: `start-ngrok.bat`
   - Enter your token
   - Copy the URL
   - Share it!

---

**Your app is ready to go global! 🌍** 

Need help? Just ask! 😊
