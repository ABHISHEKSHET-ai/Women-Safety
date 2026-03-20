# 🏗️ Women's Safety Application - Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Desktop    │  │   Mobile     │  │   Tablet     │          │
│  │   Browser    │  │   Browser    │  │   Browser    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                      │
│                  HTML/CSS/JavaScript                              │
│                   Leaflet.js (Maps)                               │
│                  MediaStream API                                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                         HTTPS/REST
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    APPLICATION LAYER                             │
│                      Spring Boot 3.5.6                           │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              SECURITY LAYER                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │ JWT Filter   │→ │ Auth Manager │→ │ Authorization   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────▼──────────────────────────────┐  │
│  │              CONTROLLER LAYER (REST APIs)                  │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │  │
│  │  │    Auth      │  │    Alert     │  │  Emergency     │  │  │
│  │  │  Controller  │  │  Controller  │  │    Contact     │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘  │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │  │
│  │  │  Unsafe Area │  │     User     │  │     Admin      │  │  │
│  │  │  Controller  │  │  Controller  │  │   Controller   │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘  │  │
│  └─────────────────────────┬───────────────────────────────────┘ │
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │              SERVICE LAYER (Business Logic)                 │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │ │
│  │  │    User      │  │    Alert     │  │   Emergency    │   │ │
│  │  │   Service    │  │   Service    │  │    Contact     │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │ │
│  │  │  Unsafe Area │  │     SMS      │  │     Email      │   │ │
│  │  │   Service    │  │   Service    │  │    Service     │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │ │
│  └─────────────────────────┬───────────────────────────────────┘ │
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │         REPOSITORY LAYER (Data Access - JPA)                │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │ │
│  │  │    User      │  │    Alert     │  │   Emergency    │   │ │
│  │  │  Repository  │  │  Repository  │  │    Contact     │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │ │
│  │  │ Unsafe Area  │  │  Location    │  │  Alert Media   │   │ │
│  │  │  Repository  │  │  Tracking    │  │   Repository   │   │ │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │ │
│  └─────────────────────────┬───────────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                        JDBC/MySQL
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      DATABASE LAYER                               │
│                       MySQL 8.0.43                                │
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  users   │  │  alerts  │  │  emergency_  │  │   unsafe_   │ │
│  │          │  │          │  │  contacts    │  │   areas     │ │
│  └──────────┘  └──────────┘  └──────────────┘  └─────────────┘ │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │  location_   │  │ alert_media  │                              │
│  │  tracking    │  │              │                              │
│  └──────────────┘  └──────────────┘                              │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       FILE STORAGE                                  │
│                   uploads/alert_{id}/                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Photos     │  │    Audio     │  │   Evidence   │            │
│  │   (JPG)      │  │   (WebM)     │  │    Files     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────────────────────────────────────────────┘
```

---

## Panic Alert Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER TRIGGERS PANIC ALERT                     │
│                                                                   │
│  User clicks RED PANIC BUTTON on Dashboard                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 1: Capture Location                        │
│                                                                   │
│  • Get GPS coordinates (latitude, longitude)                     │
│  • Reverse geocode to address                                    │
│  • Timestamp: Current date/time                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 2: Create Alert Record                     │
│                                                                   │
│  • Save to database (alerts table)                               │
│  • Status: ACTIVE                                                │
│  • alert_sent: false → true                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│           STEP 3: Send Initial Notifications                     │
│                                                                   │
│  Get all emergency contacts for user                             │
│  ├─→ Send SMS to each contact                                    │
│  └─→ Send WhatsApp to each contact                               │
│                                                                   │
│  Message includes:                                                │
│  • User name                                                      │
│  • Location (address + coordinates)                              │
│  • Time of alert                                                 │
│  • Live tracking link                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 4: Start Evidence Capture                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Photo Capture (30 seconds)                      │           │
│  │  • Take photo every 5 seconds                    │           │
│  │  • Total: 5 photos                               │           │
│  │  • Format: JPG                                   │           │
│  │  • Save to: uploads/alert_{id}/photo_{uuid}.jpg │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Audio Recording (30 seconds)                    │           │
│  │  • Continuous recording                          │           │
│  │  • Format: WebM                                  │           │
│  │  • Save to: uploads/alert_{id}/audio_{uuid}.webm│           │
│  └──────────────────────────────────────────────────┘           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 5: Upload Media to Server                      │
│                                                                   │
│  • Create FormData with photos + audio                           │
│  • POST to /api/alerts/{alertId}/media                           │
│  • Save metadata to alert_media table                            │
│  • Files stored in filesystem                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         STEP 6: Send Media Upload Notification                   │
│                                                                   │
│  Send UPDATE to all emergency contacts:                          │
│  • "EMERGENCY ALERT UPDATE from {user}"                          │
│  • Number of photos captured                                     │
│  • Audio file size                                               │
│  • Link to view evidence                                         │
│  • Link to live tracking                                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            STEP 7: Start Location Tracking                       │
│                                                                   │
│  • Update location every 10 seconds                              │
│  • Save to location_tracking table                               │
│  • Display on live tracking map                                  │
│  • Continue until alert is cancelled/resolved                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Flow Diagram

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Login Request (email, password)
       │
       ▼
┌──────────────────────┐
│  AuthController      │
│  /api/auth/login     │
└──────┬───────────────┘
       │
       │ 2. Validate credentials
       │
       ▼
┌──────────────────────┐
│   UserService        │
│  • Find user by email│
│  • Verify password   │
│    (BCrypt compare)  │
└──────┬───────────────┘
       │
       │ 3. Generate JWT Token
       │
       ▼
┌──────────────────────┐
│  JwtTokenProvider    │
│  • Create token      │
│  • Set expiration    │
│  • Sign with secret  │
└──────┬───────────────┘
       │
       │ 4. Return token + user info
       │
       ▼
┌─────────────┐
│   Client    │
│ Store token │
│ in localStorage
└──────┬──────┘
       │
       │ 5. Subsequent requests
       │    Authorization: Bearer {token}
       │
       ▼
┌──────────────────────┐
│ JwtAuthFilter        │
│ • Extract token      │
│ • Validate token     │
│ • Get user from token│
└──────┬───────────────┘
       │
       │ 6. If valid, proceed
       │
       ▼
┌──────────────────────┐
│  Controller Method   │
│  (Authorized access) │
└──────────────────────┘
```

---

## Database Entity Relationship Diagram

```
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ • id (PK)           │
│ • name              │
│ • email (UNIQUE)    │
│ • phone             │
│ • password (hashed) │
│ • address           │
│ • is_verified       │
│ • is_blocked        │
│ • created_at        │
│ • updated_at        │
└──────┬──────────────┘
       │
       │ 1:N (One user has many alerts)
       │
       ▼
┌─────────────────────┐
│      ALERTS         │
├─────────────────────┤
│ • id (PK)           │
│ • user_id (FK)      │────┐
│ • latitude          │    │
│ • longitude         │    │
│ • location          │    │
│ • status            │    │
│ • is_active         │    │
│ • alert_sent        │    │
│ • created_at        │    │
│ • resolved_at       │    │
└──────┬──────────────┘    │
       │                   │
       │ 1:N              │ 1:N
       │                   │
       ▼                   ▼
┌────────────────┐  ┌──────────────────┐
│ LOCATION_      │  │  ALERT_MEDIA     │
│ TRACKING       │  ├──────────────────┤
├────────────────┤  │ • id (PK)        │
│ • id (PK)      │  │ • alert_id (FK)  │
│ • alert_id(FK) │  │ • file_name      │
│ • latitude     │  │ • file_path      │
│ • longitude    │  │ • media_type     │
│ • address      │  │ • created_at     │
│ • tracked_at   │  └──────────────────┘
└────────────────┘

       ┌─────────────────────┐
       │       USERS         │
       └──────┬──────────────┘
              │
              │ 1:N
              │
              ▼
       ┌─────────────────────┐
       │ EMERGENCY_CONTACTS  │
       ├─────────────────────┤
       │ • id (PK)           │
       │ • user_id (FK)      │
       │ • name              │
       │ • phone             │
       │ • relation          │
       │ • created_at        │
       └─────────────────────┘

       ┌─────────────────────┐
       │       USERS         │
       └──────┬──────────────┘
              │
              │ 1:N
              │
              ▼
       ┌─────────────────────┐
       │   UNSAFE_AREAS      │
       ├─────────────────────┤
       │ • id (PK)           │
       │ • user_id (FK)      │
       │ • latitude          │
       │ • longitude         │
       │ • location          │
       │ • description       │
       │ • risk_level        │
       │ • status            │
       │ • created_at        │
       │ • updated_at        │
       └─────────────────────┘
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│  • HTML5 - Structure                                    │
│  • CSS3 - Styling (Responsive design)                   │
│  • JavaScript ES6+ - Logic                              │
│  • Leaflet.js - Interactive maps                        │
│  • MediaStream API - Camera/Audio capture               │
│  • Fetch API - HTTP requests                            │
│  • LocalStorage - Token storage                         │
└─────────────────────────────────────────────────────────┘
                           ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                         │
├─────────────────────────────────────────────────────────┤
│  Framework: Spring Boot 3.5.6                           │
│  ├─ Spring Web - REST APIs                              │
│  ├─ Spring Security - Authentication/Authorization      │
│  ├─ Spring Data JPA - ORM                               │
│  ├─ Spring Mail - Email service                         │
│  └─ Lombok - Code generation                            │
│                                                           │
│  Security:                                                │
│  ├─ JWT (JSON Web Tokens)                               │
│  ├─ BCrypt - Password hashing                           │
│  └─ CORS - Cross-origin support                         │
└─────────────────────────────────────────────────────────┘
                           ↕ JDBC
┌─────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                         │
├─────────────────────────────────────────────────────────┤
│  • MySQL 8.0.43                                         │
│  • InnoDB Storage Engine                                │
│  • UTF-8 Character Set                                  │
│  • ACID Compliance                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                      │
├─────────────────────────────────────────────────────────┤
│  • SMS Service (Twilio - optional)                      │
│  • WhatsApp Business API (optional)                     │
│  • Email (SMTP - Gmail)                                 │
│  • ngrok - External access tunneling                    │
│  • Geocoding API - Address lookup                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  DEVELOPMENT TOOLS                       │
├─────────────────────────────────────────────────────────┤
│  • Maven - Build & dependency management                │
│  • Git - Version control                                │
│  • VS Code / IntelliJ IDEA - IDE                        │
│  • Postman - API testing                                │
│  • MySQL Workbench - Database management                │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────┐
│                       INTERNET                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   LOAD BALANCER                          │
│                   (nginx/AWS ELB)                        │
└────────────┬────────────────┬───────────────────────────┘
             │                │
       ┌─────▼─────┐    ┌────▼──────┐
       │ Server 1  │    │ Server 2  │  (Horizontal Scaling)
       │ (Primary) │    │ (Backup)  │
       └─────┬─────┘    └────┬──────┘
             │               │
             └───────┬───────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              APPLICATION SERVER                          │
│              Spring Boot (JAR)                           │
│              Port: 8080                                  │
└────────────────────┬────────────────────────────────────┘
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
┌──────────────────┐  ┌──────────────────┐
│  MySQL Database  │  │  File Storage    │
│  (RDS/Dedicated) │  │  (S3/Local)      │
└──────────────────┘  └──────────────────┘
```

---

## File Structure

```
womensafetyq/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/womensafetyq/
│   │   │       ├── WomensafetyqApplication.java
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── AlertController.java
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── UserController.java
│   │   │       │   ├── UnsafeAreaController.java
│   │   │       │   └── AdminController.java
│   │   │       ├── service/
│   │   │       │   ├── AlertService.java
│   │   │       │   ├── UserService.java
│   │   │       │   ├── EmailService.java
│   │   │       │   ├── SmsService.java
│   │   │       │   ├── EmergencyContactService.java
│   │   │       │   └── UnsafeAreaService.java
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   ├── AlertRepository.java
│   │   │       │   ├── EmergencyContactRepository.java
│   │   │       │   ├── UnsafeAreaRepository.java
│   │   │       │   ├── LocationTrackingRepository.java
│   │   │       │   └── AlertMediaRepository.java
│   │   │       ├── entity/
│   │   │       │   ├── User.java
│   │   │       │   ├── Alert.java
│   │   │       │   ├── EmergencyContact.java
│   │   │       │   ├── UnsafeArea.java
│   │   │       │   ├── LocationTracking.java
│   │   │       │   └── AlertMedia.java
│   │   │       ├── dto/
│   │   │       │   ├── LoginRequest.java
│   │   │       │   ├── RegisterRequest.java
│   │   │       │   ├── PanicAlertRequest.java
│   │   │       │   └── ...
│   │   │       └── security/
│   │   │           ├── JwtTokenProvider.java
│   │   │           └── JwtAuthenticationFilter.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   │           ├── index.html
│   │           ├── login.html
│   │           ├── register.html
│   │           ├── dashboard.html
│   │           ├── emergency-contacts.html
│   │           ├── alert-history.html
│   │           ├── evidence.html
│   │           ├── community-feedback.html
│   │           ├── report-unsafe-area.html
│   │           ├── admin-login.html
│   │           ├── admin-dashboard.html
│   │           ├── css/
│   │           │   └── style.css
│   │           └── js/
│   │               ├── api.js
│   │               ├── auth.js
│   │               ├── dashboard.js
│   │               ├── emergency-contacts.js
│   │               ├── evidence.js
│   │               └── ...
├── uploads/  (Evidence storage)
├── pom.xml
├── database-setup.sql
├── create-admin.sql
└── README.md
```

---

**Use these diagrams in your PowerPoint presentation for visual impact!** 🎨
