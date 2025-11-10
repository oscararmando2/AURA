# Security Policy

## Overview

AURA Invoice System implements multiple layers of security to protect business data and prevent common web vulnerabilities in the PHP-based invoice management system.

## Security Features

### 1. Database Security
- **MySQL Database**: Relational database for invoice and product management
- **Prepared Statements**: All database queries use prepared statements to prevent SQL Injection
- **Parameter Binding**: mysqli prepared statements with parameter binding
- **Transaction Support**: MySQL transactions for data integrity
- **Connection Security**: Database credentials stored in separate configuration file

### 2. Input Validation & Sanitization
- **Server-side Validation**: All user inputs are validated on the PHP backend
- **Client-side Validation**: JavaScript pre-validation for better UX
- **Data Type Validation**: Numeric fields validated for correct data types
- **SQL Injection Protection**: Prepared statements prevent SQL injection attacks
- **XSS Prevention**: Output escaping and input sanitization

### 3. File Security
- **PDF Generation**: Server-side PDF generation using FPDF library
- **File Permissions**: Restricted write access to pdfs/ directory only
- **Path Validation**: No user-controlled file paths
- **Upload Security**: No file upload functionality (reduced attack surface)

### 4. API Security
- **JSON API**: RESTful JSON API for product search and invoice operations
- **Input Encoding**: Proper JSON encoding/decoding
- **Error Handling**: Generic error messages (no sensitive data exposure)
- **AJAX Validation**: Client and server-side validation for all AJAX requests

## Known Limitations & Recommendations

### Authentication System
**Status**: Not Implemented

**Current State**: 
- No user authentication or access control
- Invoice system is open to anyone with access to the URL

**Risk Assessment**: Medium to High (depending on deployment)

**Recommendations for Production**:
1. Implement user authentication (PHP sessions)
2. Add role-based access control
3. Protect invoice viewing and editing
4. Consider implementing:
```php
// Example authentication check
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
```

### HTTPS/SSL
**Status**: Depends on deployment

**Recommendation**: 
- Always use HTTPS in production
- Protect data in transit
- Obtain SSL certificate (Let's Encrypt is free)

### CSRF Protection
**Status**: Not Implemented

**Reason**: 
- Simple invoice application without authentication
- No sensitive state-changing operations exposed to external sites

**Risk Assessment**: Low (without authentication), Medium (with authentication)

**Recommendation for Production with Auth**:
Implement CSRF tokens for form submissions:
```php
// Generate token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// Validate token
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF validation failed');
}
```

## Production Security Checklist

### Before Deploying to Production:

- [ ] Enable HTTPS/SSL (required)
- [ ] Update database credentials in `conexion.php`
- [ ] Set strong MySQL root password
- [ ] Restrict database access (localhost only if possible)
- [ ] Set proper file permissions on `pdfs/` directory (755)
- [ ] Restrict access to `conexion.php` (prevent web access)
- [ ] Set up database backups (automated)
- [ ] Implement user authentication system
- [ ] Add CSRF protection for forms
- [ ] Configure PHP error reporting (hide errors in production)
- [ ] Implement logging and monitoring
- [ ] Set up web application firewall (WAF)
- [ ] Regular security updates for PHP and MySQL
- [ ] Implement rate limiting at web server level

## Database Configuration

### Security Settings in conexion.php:
```php
define('DB_HOST', 'localhost');  // Use localhost only
define('DB_USER', 'invoice_user'); // Create dedicated DB user
define('DB_PASS', 'strong-random-password-here');
define('DB_NAME', 'el_mexiquense_market');

// Use mysqli prepared statements (already implemented)
// Set connection charset to prevent SQL injection
mysqli_set_charset($conn, "utf8mb4");
```

### MySQL User Privileges:
```sql
-- Create dedicated user with minimal privileges
CREATE USER 'invoice_user'@'localhost' IDENTIFIED BY 'strong-password';
GRANT SELECT, INSERT, UPDATE ON el_mexiquense_market.* TO 'invoice_user'@'localhost';
FLUSH PRIVILEGES;
```

## Security Best Practices

1. **Keep Software Updated**: Update PHP, MySQL, and libraries regularly
2. **Monitor Logs**: Watch for suspicious activity patterns in web server logs
3. **Regular Backups**: Backup MySQL database regularly (automated scripts)
4. **HTTPS Only**: Never deploy without HTTPS in production
5. **Strong Passwords**: Use strong MySQL passwords (minimum 16 characters)
6. **Principle of Least Privilege**: Limit database user permissions
7. **Input Validation**: Always validate and sanitize user input
8. **Error Handling**: Configure PHP to hide errors in production (`display_errors = Off`)
9. **File Permissions**: Set restrictive permissions (644 for files, 755 for directories)
10. **Regular Audits**: Perform security audits periodically

## File Permissions

Recommended file permissions for production:

```bash
# PHP files (read-only for web server)
chmod 644 *.php

# Configuration file (extra protection)
chmod 600 conexion.php

# PDF directory (write access for web server)
chmod 755 pdfs/
chown www-data:www-data pdfs/

# Database credentials (if using file-based config)
chmod 400 .env
```

## PHP Configuration (php.ini)

Recommended security settings:

```ini
; Hide PHP version
expose_php = Off

; Disable dangerous functions
disable_functions = exec,passthru,shell_exec,system,proc_open,popen

; Hide errors in production
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log

; Session security
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1

; File upload (if enabled in future)
file_uploads = On
upload_max_filesize = 2M
```

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by emailing the development team instead of using the public issue tracker.

## Security Tools & Technologies

- **PHP mysqli**: Prepared statements for SQL injection prevention
- **FPDF**: Secure PDF generation library
- **MySQL**: Relational database with transaction support
- **JavaScript**: Client-side validation and user experience

## Compliance

This application implements security measures aligned with:
- OWASP Top 10 Web Application Security Risks
- PCI DSS guidelines (for financial data handling)
- General security best practices for PHP applications

## Regular Updates

Security measures should be reviewed and updated regularly. Check this document for the latest security information.

**Last Updated**: November 2025  
**Version**: 2.0 (PHP Invoice System)
