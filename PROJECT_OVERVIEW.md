# 🚨 Women's Safety Application - Complete Project Overview

## 📋 Table of Contents
1. [Project Introduction](#project-introduction)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [Setup Instructions](#setup-instructions)
7. [How to Use](#how-to-use)
8. [Presentation Guide](#presentation-guide)
9. [API Documentation](#api-documentation)

---

## 📖 Project Introduction

**Women's Safety Application** is a comprehensive safety platform designed to help women in emergency situations. The application provides:

- **Real-time panic alerts** with automatic location tracking
- **Evidence capture** (photos & audio) during emergencies
- **Emergency contact notifications** via SMS/WhatsApp
- **Community reporting** of unsafe areas
- **Live location tracking** for emergency responders
- **Admin dashboard** for monitoring and management

### Purpose
To provide women with a quick, reliable way to alert their emergency contacts and authorities during dangerous situations, with automated evidence collection and location tracking.

---

## 💻 Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 25
- **Database**: MySQL 8.0.43
- **Security**: Spring Security + JWT Authentication
- **Build Tool**: Maven 3.9.11
- **ORM**: Hibernate/JPA

### Frontend
- **HTML5, CSS3, JavaScript (ES6)**
- **Leaflet.js** - Interactive maps
- **Responsive Design** - Mobile-first approach

### External Services
- **ngrok** - External access tunneling
- **Geolocation API** - Location tracking
- **MediaStream API** - Camera & audio capture

### Development Environment
- **OS**: Windows 11 (24H2)
- **IDE**: VS Code / IntelliJ IDEA
- **Server Port**: 8080

---

## 🎯 Key Features

### 1. **User Management**
- ✅ User Registration with email/phone
- ✅ Secure Login with JWT tokens
- ✅ Profile Management
- ✅ Password Reset functionality

### 2. **Panic Alert System**
- 🚨 **One-click panic button**
- 📍 **Automatic GPS location capture**
- 📸 **Auto-capture 5 photos** (every 5 seconds for 30 seconds)
- 🎤 **30-second audio recording**
- 📱 **Instant SMS/WhatsApp notifications** to emergency contacts
- 🗺️ **Live location tracking**

### 3. **Emergency Contacts**
- 👥 Add/Edit/Delete emergency contacts
- 📞 Contact information (name, phone, relation)
- 🔔 Automatic notification on panic alert
- 📨 Receive location + evidence links

### 4. **Evidence Gallery**
- 📷 View all captured photos
- 🎵 Play recorded audio
- 🔍 Filter by alert, date, type
- 💾 Download evidence files
- 🔐 Secure, authenticated access

### 5. **Unsafe Area Reporting**
- 📍 Report dangerous locations on map
- ⚠️ Mark risk levels (Low/Medium/High)
- 📝 Add descriptions and details
- 🗺️ Community visibility of all reports
- 🔴 Color-coded risk markers

### 6. **Location Tracking**
- 🌍 Real-time GPS tracking during alerts
- 📊 Location history timeline
- 🗺️ Interactive map with route visualization
- 🔄 Continuous updates every 10 seconds

### 7. **Admin Panel**
- 📊 Dashboard with statistics
- 👥 User management (block/unblock)
- 🚨 Active alerts monitoring
- 📍 Unsafe area approval/rejection
- 📈 Analytics and reports

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Client Layer                        │
│  (HTML/CSS/JS - Responsive Web Interface)           │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼───────────────────────────────────┐
│              Spring Boot Backend                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Controllers (REST Endpoints)               │   │
│  │  - AuthController                           │   │
│  │  - AlertController                          │   │
│  │  - UserController                           │   │
│  │  - UnsafeAreaController                     │   │
│  │  - AdminController                          │   │
│  └─────────────────┬───────────────────────────┘   │
│                    │                                 │
│  ┌─────────────────▼───────────────────────────┐   │
│  │  Service Layer (Business Logic)            │   │
│  │  - AlertService                             │   │
│  │  - UserService                              │   │
│  │  - EmailService                             │   │
│  │  - SmsService                               │   │
│  │  - EmergencyContactService                  │   │
│  └─────────────────┬───────────────────────────┘   │
│                    │                                 │
│  ┌─────────────────▼───────────────────────────┐   │
│  │  Repository Layer (Data Access)             │   │
│  │  - JPA Repositories                         │   │
│  └─────────────────┬───────────────────────────┘   │
└────────────────────┼─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│              MySQL Database                          │
│  - users, alerts, emergency_contacts                 │
│  - unsafe_areas, location_tracking, alert_media      │
└──────────────────────────────────────────────────────┘
```

### Security Layer

```
Request → JWT Filter → Authentication → Authorization → Controller
```

- **JWT Tokens**: Stateless authentication
- **BCrypt**: Password hashing
- **CORS**: Cross-origin resource sharing
- **HTTPS**: Secure communication (via ngrok in production)

---

## 🗄️ Database Schema

### Tables

#### 1. **users**
```sql
- id (BIGINT, PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- phone (VARCHAR)
- password (VARCHAR, BCrypt hashed)
- address (TEXT)
- is_verified (BOOLEAN)
- is_blocked (BOOLEAN)
- created_at (DATETIME)
- updated_at (DATETIME)
```

#### 2. **alerts**
```sql
- id (BIGINT, PRIMARY KEY)
- user_id (BIGINT, FOREIGN KEY → users.id)
- latitude (DOUBLE)
- longitude (DOUBLE)
- location (TEXT)
- status (ENUM: ACTIVE, RESOLVED, CANCELLED, CLOSED)
- is_active (BOOLEAN)
- alert_sent (BOOLEAN)
- recording_started (BOOLEAN)
- created_at (DATETIME)
- resolved_at (DATETIME)
```

#### 3. **emergency_contacts**
```sql
- id (BIGINT, PRIMARY KEY)
- user_id (BIGINT, FOREIGN KEY → users.id)
- name (VARCHAR)
- phone (VARCHAR)
- relation (VARCHAR)
- created_at (DATETIME)
```

#### 4. **unsafe_areas**
```sql
- id (BIGINT, PRIMARY KEY)
- user_id (BIGINT, FOREIGN KEY → users.id)
- latitude (DOUBLE)
- longitude (DOUBLE)
- location (TEXT)
- description (TEXT)
- risk_level (ENUM: LOW, MEDIUM, HIGH)
- status (ENUM: PENDING, APPROVED, REJECTED)
- created_at (DATETIME)
- updated_at (DATETIME)
```

#### 5. **location_tracking**
```sql
- id (BIGINT, PRIMARY KEY)
- alert_id (BIGINT, FOREIGN KEY → alerts.id)
- latitude (DOUBLE)
- longitude (DOUBLE)
- address (TEXT)
- tracked_at (DATETIME)
```

#### 6. **alert_media**
```sql
- id (BIGINT, PRIMARY KEY)
- alert_id (BIGINT, FOREIGN KEY → alerts.id)
- file_name (VARCHAR)
- file_path (VARCHAR)
- media_type (ENUM: IMAGE, AUDIO)
- created_at (DATETIME)
```

### Relationships
- **One-to-Many**: User → Alerts
- **One-to-Many**: User → Emergency Contacts
- **One-to-Many**: User → Unsafe Areas
- **One-to-Many**: Alert → Location Tracking
- **One-to-Many**: Alert → Alert Media

---

## ⚙️ Setup Instructions

### Prerequisites
- ✅ Java 25 (JDK)
- ✅ MySQL 8.0+
- ✅ Maven 3.9+
- ✅ Modern web browser (Chrome/Firefox/Edge)
- ✅ ngrok (for external access)

### Step 1: Database Setup

1. **Install MySQL** (if not already installed)

2. **Create Database**:
```sql
CREATE DATABASE women_safety_db;
USE women_safety_db;
```

3. **Run Setup Scripts**:
```bash
# Run from project root
mysql -u root -p women_safety_db < database-setup.sql
mysql -u root -p women_safety_db < create-admin.sql
```

### Step 2: Configure Application

1. **Edit `application.properties`**:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/women_safety_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Server Configuration
server.port=8080
server.address=0.0.0.0
```

### Step 3: Build & Run

#### Method 1: Using Maven Wrapper (Recommended)
```bash
cd d:\womensafetyq\womensafetyq
.\mvnw.cmd spring-boot:run
```

#### Method 2: Using start-all.bat (Includes ngrok)
```bash
# Double-click start-all.bat
# OR from command line:
.\start-all.bat
```

### Step 4: Access Application

**Local Access**:
- URL: `http://localhost:8080`

**External Access (via ngrok)**:
- Run ngrok: `.\ngrok.exe http 8080`
- Get public URL: `https://xxxxx.ngrok-free.app`

### Step 5: Initial Login

**Admin Account**:
- Username: `admin`
- Password: `admin123`
- URL: `http://localhost:8080/admin-login.html`

**Create User Account**:
- Register at: `http://localhost:8080/register.html`

---

## 📱 How to Use

### For End Users

#### 1. **Registration & Login**
1. Open `http://localhost:8080/register.html`
2. Fill in details (name, email, phone, password)
3. Click "Register"
4. Login with credentials

#### 2. **Add Emergency Contacts**
1. Navigate to **Emergency Contacts** page
2. Click "Add Contact"
3. Enter name, phone number, relation
4. Save contact
5. Repeat for multiple contacts (recommended: 3-5 contacts)

#### 3. **Using Panic Button**
1. Go to **Dashboard**
2. Click the **RED PANIC BUTTON**
3. Allow camera and microphone permissions
4. System automatically:
   - Captures your location
   - Takes 5 photos (one every 5 seconds)
   - Records 30 seconds of audio
   - Sends SMS/WhatsApp to all emergency contacts
   - Starts live location tracking

#### 4. **View Evidence**
1. Navigate to **Evidence Gallery**
2. View all captured photos and audio
3. Filter by date or alert
4. Download if needed

#### 5. **Report Unsafe Area**
1. Go to **Report Unsafe Area**
2. Click on map location OR use current location
3. Select risk level (Low/Medium/High)
4. Add description
5. Submit report

#### 6. **View Community Reports**
1. Open **Community Feedback**
2. See all reported unsafe areas on map
3. Color-coded by risk level:
   - 🔴 Red = High Risk
   - 🟡 Yellow = Medium Risk
   - 🟢 Green = Low Risk

### For Administrators

#### 1. **Login to Admin Panel**
1. Go to `http://localhost:8080/admin-login.html`
2. Username: `admin`, Password: `admin123`

#### 2. **Monitor Active Alerts**
1. View real-time alerts on dashboard
2. See user location, time, status
3. Update alert status (Resolved/Closed)

#### 3. **Manage Users**
1. View all registered users
2. Block/Unblock suspicious users
3. Delete spam accounts

#### 4. **Review Unsafe Area Reports**
1. View pending reports
2. Approve legitimate reports
3. Reject spam/fake reports

---

## 🎤 Presentation Guide

### Slide 1: Title Slide
**Title**: Women's Safety Application  
**Subtitle**: Emergency Alert System with Real-time Tracking  
**Your Name & Date**

### Slide 2: Problem Statement
- Statistics on women's safety issues
- Need for quick emergency response
- Challenges in current solutions

### Slide 3: Our Solution
- One-click panic alert system
- Automatic evidence collection
- Real-time location tracking
- Community safety awareness

### Slide 4: Technology Stack
- Show architecture diagram
- Mention Spring Boot, MySQL, Java
- Frontend technologies
- Security features (JWT, BCrypt)

### Slide 5: Key Features Demo
**Live Demo Flow**:
1. User Registration
2. Add Emergency Contact
3. **Panic Button Demo** (highlight feature)
4. Show Evidence Gallery
5. Community Unsafe Areas Map

### Slide 6: Panic Alert Flow (Diagram)
```
User Presses Panic Button
        ↓
Get GPS Location
        ↓
Capture Photos (5 photos)
        ↓
Record Audio (30 seconds)
        ↓
Send Notifications to Contacts
        ↓
Start Live Location Tracking
```

### Slide 7: Database & Architecture
- Show ER diagram
- Explain relationships
- Security layer

### Slide 8: Admin Features
- User management
- Alert monitoring
- Unsafe area moderation
- Analytics dashboard

### Slide 9: Security Features
- JWT Authentication
- Password encryption (BCrypt)
- Secure file storage
- HTTPS support

### Slide 10: Live Demo
**Demonstrate**:
- Register a new user
- Add emergency contact
- Click panic button
- Show notifications in console
- Display captured photos/audio
- Show live location on map

### Slide 11: Future Enhancements
- Real SMS/WhatsApp integration (Twilio)
- Mobile app (Android/iOS)
- AI-based threat detection
- Police station integration
- SOS to nearby users

### Slide 12: Conclusion
- Impact on women's safety
- Scalability potential
- Thank you & Q&A

---

## 📚 API Documentation

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "password": "securepass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securepass123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Alert APIs

#### Create Panic Alert
```http
POST /api/alerts/panic
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "location": "Mumbai, Maharashtra"
}
```

#### Upload Media
```http
POST /api/alerts/{alertId}/media
Authorization: Bearer {token}
Content-Type: multipart/form-data

photos: [File, File, ...]
audio: File
```

#### Get Alert History
```http
GET /api/alerts/history
Authorization: Bearer {token}
```

### Emergency Contact APIs

#### Get Contacts
```http
GET /api/user/emergency-contacts
Authorization: Bearer {token}
```

#### Add Contact
```http
POST /api/user/emergency-contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "relation": "Brother"
}
```

### Unsafe Area APIs

#### Report Unsafe Area
```http
POST /api/unsafe-areas/report
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "location": "Mumbai",
  "description": "Poor lighting at night",
  "riskLevel": "HIGH"
}
```

#### Get Community Reports (Public)
```http
GET /api/unsafe-areas/community
```

---

## 🎬 Demo Script

### Preparation
1. Start MySQL database
2. Run `start-all.bat` to start server and ngrok
3. Open browser to `http://localhost:8080`
4. Have a second browser/device ready for mobile view

### Demo Flow (10 minutes)

**Minute 1-2: Introduction**
- "Today I'll demo a Women's Safety Application"
- "It helps women in emergency situations"
- "Key feature: One-click panic alert"

**Minute 3-4: User Registration**
- Register new user "Demo User"
- Show secure password validation
- Login successfully

**Minute 5-6: Emergency Contacts**
- Add 2-3 emergency contacts
- Explain notification system
- Show contact management

**Minute 7-8: PANIC BUTTON (Main Feature)**
- Click big red panic button
- Show location capture
- Allow camera/microphone
- Explain: "Taking 5 photos + 30sec audio"
- Show console logs: SMS notifications sent

**Minute 9: Evidence Gallery**
- Navigate to Evidence page
- Show captured photos
- Play recorded audio
- Explain secure storage

**Minute 10: Community Features**
- Report unsafe area on map
- View all community reports
- Color-coded risk levels
- Show admin moderation

---

## 💡 Tips for Successful Presentation

### Technical Tips
1. **Test everything before demo**
   - Start server 10 minutes early
   - Test panic button
   - Verify camera/mic permissions

2. **Have backup**
   - Screenshots of key features
   - Recorded video demo
   - PowerPoint slides

3. **Internet connection**
   - Use local network (no need for internet)
   - Have ngrok ready for remote demo

### Presentation Tips
1. **Start with impact**
   - Share a real-world safety incident
   - Explain why this matters

2. **Focus on panic button**
   - This is your unique feature
   - Emphasize automatic evidence collection

3. **Show, don't tell**
   - Live demo is powerful
   - Let audience see it work

4. **Explain technical depth**
   - Mention JWT, Spring Boot
   - Show database design
   - Explain security

5. **End with vision**
   - Future enhancements
   - Social impact
   - Scalability

### Common Questions & Answers

**Q: Is this a mobile app?**  
A: Currently it's a Progressive Web App (works on mobile browsers). Native app is planned.

**Q: How do emergency contacts receive alerts?**  
A: Via SMS and WhatsApp (currently console logging, can integrate Twilio).

**Q: What if there's no internet?**  
A: GPS works offline; alerts are queued and sent when connection is restored.

**Q: Is the data secure?**  
A: Yes - JWT authentication, encrypted passwords, secure file storage.

**Q: Can police access the data?**  
A: Admin panel can be extended for authorized law enforcement access.

---

## 📞 Project Team & Credits

**Developed by**: [Your Name]  
**Institution**: [Your College/University]  
**Year**: 2025  
**Technology**: Spring Boot + MySQL + JavaScript  

---

## 📄 License & Usage

This project is for educational purposes. Can be extended for commercial use with proper licensing.

---

**For any questions or support, refer to:**
- README.md
- QUICK_START.md
- PANIC_ALERT_FIX.md

**Good luck with your presentation! 🎉**
