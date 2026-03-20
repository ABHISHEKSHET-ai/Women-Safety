# Women Safety Platform

A comprehensive safety platform designed to protect and empower women through technology. This application provides emergency response systems, community awareness, and real-time monitoring.

## Features

### User Features
- **Landing/Home Screen**: Welcome page with platform overview and feature highlights
- **User Registration & Login**: Secure authentication with JWT tokens
- **User Dashboard**: Central hub with panic button and quick access to features
- **Panic Alert System**: One-click emergency alert to notify all emergency contacts
- **Live Location Tracking**: Real-time GPS tracking during active alerts
- **Emergency Contacts Management**: Add, edit, and manage trusted contacts
- **Alert History**: View past alerts with location and status
- **Report Unsafe Areas**: Community-driven reporting of dangerous locations
- **Community Feedback Map**: View marked unsafe zones with risk levels
- **Profile Management**: Update personal information and settings

### Admin Features
- **Admin Dashboard**: Overview with statistics and key metrics
- **Alert Management**: Monitor and respond to active panic alerts
- **User Management**: View, block, unblock, and manage user accounts
- **Report Management**: Review and approve/reject unsafe area reports
- **Analytics**: Track platform usage and safety incidents

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 25
- **Database**: MySQL
- **Security**: Spring Security + JWT Authentication
- **ORM**: Spring Data JPA / Hibernate
- **Email**: Spring Boot Mail

### Frontend
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Maps**: Leaflet.js for interactive mapping
- **Responsive Design**: Mobile-first approach

## Prerequisites

- Java 25 (or compatible version)
- Maven 3.6+
- MySQL 8.0+
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation & Setup

### 1. Database Setup

```sql
CREATE DATABASE women_safety_db;
```

The application will auto-create tables on first run using Hibernate DDL.

### 2. Application Configuration

Edit `src/main/resources/application.properties`:

```properties
# Update database credentials
spring.datasource.username=root
spring.datasource.password=your_password

# Update email configuration (for alerts and password reset)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3. Build and Run

```bash
# Navigate to project directory
cd womensafetyq

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Create Admin Account

You'll need to manually insert an admin record in the database:

```sql
USE women_safety_db;

INSERT INTO admins (name, username, email, password, created_at)
VALUES ('Admin', 'admin', 'admin@womensafety.com', 
        '$2a$10$YourBcryptHashedPasswordHere', NOW());
```

To generate a BCrypt password hash, you can use online tools or run this Java code:
```java
String hashedPassword = new BCryptPasswordEncoder().encode("your_password");
System.out.println(hashedPassword);
```

## Usage Guide

### For Users

1. **Register**: Create an account at `/register.html`
2. **Add Emergency Contacts**: Navigate to Emergency Contacts and add trusted people
3. **Enable Location**: Allow browser location permissions
4. **Use Panic Button**: In emergency, click the panic button on dashboard
5. **Report Unsafe Areas**: Help community by reporting dangerous locations

### For Admins

1. **Login**: Access admin panel at `/admin-login.html`
2. **Monitor Alerts**: View and respond to active panic alerts
3. **Manage Users**: View user list and moderate accounts
4. **Review Reports**: Approve or reject unsafe area reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/emergency-contacts` - List contacts
- `POST /api/user/emergency-contacts` - Add contact
- `PUT /api/user/emergency-contacts/{id}` - Update contact
- `DELETE /api/user/emergency-contacts/{id}` - Delete contact

### Alerts
- `POST /api/alerts/panic` - Create panic alert
- `GET /api/alerts/history` - Get alert history
- `GET /api/alerts/{id}` - Get alert details
- `POST /api/alerts/{id}/location` - Add location tracking
- `GET /api/alerts/{id}/location-history` - Get location history
- `PUT /api/alerts/{id}/cancel` - Cancel alert

### Unsafe Areas
- `POST /api/unsafe-areas/report` - Report unsafe area
- `GET /api/unsafe-areas/community` - Get approved reports

### Admin
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/block` - Block user
- `PUT /api/admin/users/{id}/unblock` - Unblock user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/alerts` - Get active alerts
- `PUT /api/admin/alerts/{id}/status` - Update alert status
- `GET /api/admin/reports` - Get pending reports
- `PUT /api/admin/reports/{id}/status` - Update report status

## Security Features

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for API security
- Session management with stateless architecture
- Secure password reset flow
- Role-based access control (User/Admin)

## Email Configuration for Gmail

1. Enable 2-factor authentication in Gmail
2. Generate App Password: Account Settings > Security > App Passwords
3. Use the generated password in `application.properties`

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database `women_safety_db` exists

### Email Not Sending
- Verify email credentials
- Check if less secure app access is enabled (for Gmail)
- Use App Password instead of regular password

### Location Not Working
- Enable browser location permissions
- Use HTTPS in production (HTTP works for localhost)

### Compilation Errors
- Ensure Java 25 is installed: `java -version`
- Clean and rebuild: `mvn clean install`

## Project Structure

```
womensafetyq/
├── src/main/
│   ├── java/com/example/womensafetyq/
│   │   ├── config/         # Security and app configuration
│   │   ├── controller/     # REST API controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entities
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # JWT and security components
│   │   └── service/        # Business logic
│   └── resources/
│       ├── application.properties
│       └── static/         # Frontend files
│           ├── css/
│           ├── js/
│           └── *.html
└── pom.xml
```

## Contributing

This is a safety-critical application. Contributions should prioritize:
- Security and privacy
- Reliability and performance
- User experience
- Accessibility

## License

This project is created for educational and safety purposes.

## Support

For issues or questions:
- Email: support@womensafety.com
- Emergency Helpline: 911

## Future Enhancements

- Mobile app (Android/iOS)
- SMS integration for emergency alerts
- Integration with local police/emergency services
- Offline mode support
- Multi-language support
- Voice-activated panic button
- Social media integration
- Advanced analytics and heatmaps

---

**Remember**: This platform is a tool to enhance safety. Always contact emergency services (911) in critical situations.
