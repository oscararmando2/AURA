# Security Policy

## Overview

AURA STUDIO website implements multiple layers of security to protect user data and prevent common web vulnerabilities.

## Security Features

### 1. Authentication & Authorization
- **Password Hashing**: All passwords are hashed using bcryptjs with 10 salt rounds
- **Session Management**: Secure session-based authentication with httpOnly cookies
- **Session Security**: 
  - httpOnly flag prevents XSS access to session cookies
  - secure flag enabled in production (requires HTTPS)
  - sameSite: 'lax' provides CSRF protection for top-level navigation
  - 24-hour session expiration

### 2. Rate Limiting
- **General Rate Limit**: 100 requests per 15 minutes per IP
- **Authentication Rate Limit**: 5 login/register attempts per 15 minutes per IP
- Prevents brute force attacks and DDoS attempts

### 3. Input Validation
- **Server-side validation**: All user inputs are validated on the server
- **Client-side validation**: Pre-validation for better UX
- **SQL Injection Protection**: All database queries use prepared statements
- **Email Validation**: Regex pattern prevents ReDoS attacks

### 4. HTTP Security Headers (Helmet)
- **HSTS**: Strict-Transport-Security enforces HTTPS
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-DNS-Prefetch-Control**: Controls DNS prefetching
- **Referrer-Policy**: Controls referrer information
- **Cross-Origin Policies**: COOP, CORP for isolation

### 5. Third-Party Integration Security
- **MercadoPago**: Origin validation for postMessage events
- Validates messages come from trusted MercadoPago domains
- Prevents XSS attacks via message spoofing

### 6. Database Security
- **SQLite**: Local file-based database (aura_studio.db)
- **Prepared Statements**: All queries use parameterized statements
- **Sensitive Data**: Passwords never stored in plain text
- Database file should be excluded from web-accessible directories

## Known Limitations

### Content Security Policy (CSP)
**Status**: Disabled

**Reason**: The application uses multiple external resources:
- MercadoPago payment integration
- Google Fonts
- CDN libraries (AOS animations)
- Embedded Google Maps

**Mitigation**: 
- All external resources are from trusted, well-known providers
- Origin validation implemented for postMessage communications

**Recommendation for Production**: 
Implement a strict CSP with whitelisted domains:
```javascript
contentSecurityPolicy: {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://secure.mlstatic.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
        frameSrc: ["https://www.google.com", "https://www.mercadopago.com.mx"]
    }
}
```

### CSRF Protection
**Status**: Not Implemented

**Reason**: 
- Application uses JSON API with session cookies
- SameSite='lax' provides some CSRF protection
- No traditional form submissions with CSRF tokens

**Risk Assessment**: Low to Medium
- Modern browsers support SameSite cookies
- Rate limiting prevents abuse
- Authentication endpoints are rate-limited

**Mitigation**:
- SameSite cookie attribute set to 'lax'
- httpOnly prevents JavaScript access to session cookies
- Rate limiting prevents brute force attempts

**Recommendation for Production**:
Consider implementing CSRF tokens for sensitive operations:
```bash
npm install csrf-csrf
```

## Production Security Checklist

### Before Deploying to Production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure strong `SESSION_SECRET` environment variable
- [ ] Enable HTTPS/SSL for secure cookies
- [ ] Review and adjust rate limiting thresholds
- [ ] Implement proper CSP with whitelisted domains
- [ ] Set up database backups
- [ ] Configure proper file permissions for database
- [ ] Implement logging and monitoring
- [ ] Add CSRF protection if needed
- [ ] Review and update security headers
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Set up automated security scanning
- [ ] Regular dependency updates (`npm audit`)

## Environment Variables

### Required for Production:
```bash
NODE_ENV=production
SESSION_SECRET=your-very-long-random-secret-key-here
PORT=3000
```

### Optional:
```bash
# Database path (default: ./aura_studio.db)
DATABASE_PATH=/path/to/database/aura_studio.db

# Rate limiting (requests per window)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Auth rate limiting
AUTH_RATE_LIMIT_MAX=5
AUTH_RATE_LIMIT_WINDOW_MS=900000
```

## Security Best Practices

1. **Keep Dependencies Updated**: Run `npm audit` regularly
2. **Monitor Logs**: Watch for suspicious activity patterns
3. **Regular Backups**: Backup database regularly
4. **HTTPS Only**: Never deploy without HTTPS in production
5. **Strong Secrets**: Use long, random session secrets
6. **Principle of Least Privilege**: Limit database and file permissions
7. **Input Validation**: Always validate and sanitize user input
8. **Error Handling**: Never expose sensitive information in errors
9. **Security Headers**: Keep Helmet configuration up to date
10. **Regular Audits**: Perform security audits periodically

## Reporting Security Issues

If you discover a security vulnerability, please email the security team instead of using the public issue tracker.

## Security Tools Used

- **bcryptjs**: Password hashing
- **express-session**: Session management
- **express-rate-limit**: Rate limiting
- **helmet**: Security headers
- **sqlite3**: Database with prepared statements

## Compliance

This application implements security measures aligned with:
- OWASP Top 10 Web Application Security Risks
- NIST Cybersecurity Framework
- General Data Protection Regulation (GDPR) principles

## Regular Updates

Security measures are reviewed and updated regularly. Check this document for the latest security information.

**Last Updated**: November 2025
