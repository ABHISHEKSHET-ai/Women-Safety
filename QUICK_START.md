# 🚀 Quick Start Guide - Women's Safety Platform

## ⚡ Fast Setup (5 Minutes)

### Step 1: Database Setup

**Option A: Using MySQL Workbench or Command Line**
```sql
CREATE DATABASE women_safety_db;
```

**Option B: Use the provided SQL script**
```bash
mysql -u root -p < database-setup.sql
```

### Step 2: Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Update these lines with your MySQL credentials:
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Update email settings (optional for now):
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Step 3: Build & Run

**Option 1: Skip tests (fastest)**
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

**Option 2: Run with tests**
```bash
mvn clean install
mvn spring-boot:run
```

### Step 4: Access Application

Open your browser and go to:
```
http://localhost:8080
```

---

## 🔧 Troubleshooting

### Problem: Maven test failures

**Solution 1 (Quick Fix):**
```bash
mvn clean install -DskipTests
```

**Solution 2 (Permanent Fix):**
I've already configured H2 in-memory database for tests. Just run:
```bash
mvn clean install
```

### Problem: Database connection failed

**Check:**
1. ✅ MySQL is running
2. ✅ Database `women_safety_db` exists
3. ✅ Username/password in `application.properties` is correct

**Create database manually:**
```sql
mysql -u root -p
CREATE DATABASE women_safety_db;
EXIT;
```

### Problem: Email not sending

**For testing, you can skip email configuration.**

Email is only needed for:
- Password reset
- Panic alerts to emergency contacts

To configure later (Gmail):
1. Enable 2FA in Gmail
2. Generate App Password
3. Update `application.properties`

### Problem: Port 8080 already in use

**Solution 1: Change port**
Add to `application.properties`:
```properties
server.port=8081
```

**Solution 2: Kill process on 8080**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Find the PID from above command and replace <PID>
```

---

## 📱 Using the Application

### First Time Setup

1. **Go to Homepage**
   ```
   http://localhost:8080
   ```

2. **Register a User Account**
   - Click "Register Now"
   - Fill in details
   - Click "Register"

3. **Add Emergency Contacts**
   - Login with your credentials
   - Go to "Emergency Contacts"
   - Add at least 2 contacts

4. **Enable Location**
   - Allow browser location permissions when prompted
   - This is required for panic alerts

### Testing Panic Button

1. Go to Dashboard
2. Click the red "🚨 PANIC ALERT" button
3. Confirm the alert
4. Alert will be sent to all emergency contacts
5. Live tracking will start

### Admin Access

**Default Admin Credentials:**
- URL: `http://localhost:8080/admin-login.html`
- Username: `admin`
- Password: `admin123`

**Admin can:**
- View all active alerts
- Manage users (block/unblock)
- Approve/reject unsafe area reports
- View statistics

---

## 🎯 Quick Command Reference

```bash
# Clean build
mvn clean

# Build without tests (fastest)
mvn clean install -DskipTests

# Build with tests
mvn clean install

# Run application
mvn spring-boot:run

# Build JAR file
mvn package -DskipTests

# Run JAR file
java -jar target/womensafetyq-0.0.1-SNAPSHOT.jar
```

---

## 📊 Application URLs

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:8080 | Landing page |
| Register | http://localhost:8080/register.html | User registration |
| Login | http://localhost:8080/login.html | User login |
| Dashboard | http://localhost:8080/dashboard.html | User dashboard |
| Admin Login | http://localhost:8080/admin-login.html | Admin access |
| Admin Dashboard | http://localhost:8080/admin-dashboard.html | Admin panel |

---

## 🔒 Security Notes

1. **Change default admin password** in production
2. **Use HTTPS** in production (not HTTP)
3. **Update JWT secret** in `application.properties`
4. **Configure proper email credentials**
5. **Enable CORS only for trusted domains** in production

---

## 💡 Tips

1. **Browser Console**: Press F12 to see any JavaScript errors
2. **Location Permission**: Must be allowed for panic alerts to work
3. **Database**: All tables auto-create on first run
4. **Email Testing**: You can test without email initially
5. **Mobile Testing**: Works on mobile browsers too

---

## 🆘 Still Having Issues?

### Check Server Logs
Look for errors in the console where you ran `mvn spring-boot:run`

### Check Browser Console
Press F12 → Console tab to see JavaScript errors

### Common Error Solutions

**"Cannot connect to database"**
→ Make sure MySQL is running and credentials are correct

**"Port already in use"**
→ Change port in application.properties or kill process on 8080

**"404 Not Found"**
→ Make sure you're accessing the correct URL (check URLs table above)

**"Panic button not working"**
→ Allow location permissions in browser

**"Tests failing"**
→ Run with `-DskipTests` flag

---

## ✅ Verification Checklist

After starting the application, verify:

- [ ] Can access http://localhost:8080
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can see dashboard
- [ ] Can add emergency contacts
- [ ] Location permission requested
- [ ] Can click panic button (don't submit unless testing)
- [ ] Can access admin panel with admin/admin123

---

## 🎉 You're Ready!

The application is now running. Start by:
1. Creating a user account
2. Adding emergency contacts
3. Exploring the features

**Need help?** Check the main README.md for detailed documentation.

---

**Emergency Helpline:** 911 (in case of real emergency)
