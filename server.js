/**
 * AURA STUDIO Backend Server
 * Handles user registration, login, and database operations
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Database setup
const db = new sqlite3.Database('./aura_studio.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table ready.');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            preapproval_id TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating subscriptions table:', err.message);
        } else {
            console.log('Subscriptions table ready.');
        }
    });
}

// Security middleware
// Note: CSP is disabled to allow external resources (MercadoPago, Google Fonts, CDN libraries)
// In production, consider implementing a strict CSP with whitelisted domains
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register attempts per windowMs
    message: 'Demasiados intentos de autenticación, por favor intente más tarde.'
});

app.use(limiter);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Session configuration
// Note: CSRF protection is not implemented for this JSON API
// Sessions are used only for authentication, not for state-changing operations via forms
// For production, consider adding CSRF tokens if serving HTML forms
app.use(session({
    secret: process.env.SESSION_SECRET || 'aura-studio-secret-key-2025-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: isProduction, // Use secure cookies in production
        sameSite: 'lax' // Provides some CSRF protection
    }
}));

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// User registration
app.post('/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Todos los campos son requeridos' 
        });
    }

    // Validate email format (simple regex to prevent ReDoS)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email inválido' 
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ 
                            success: false, 
                            message: 'El usuario o email ya existe' 
                        });
                    }
                    console.error('Error registering user:', err.message);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error al registrar usuario' 
                    });
                }

                // Set session
                req.session.userId = this.lastID;
                req.session.username = username;

                res.json({ 
                    success: true, 
                    message: 'Usuario registrado exitosamente',
                    redirect: '/'
                });
            }
        );
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
});

// User login
app.post('/login', authLimiter, (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario y contraseña son requeridos' 
        });
    }

    // Find user in database
    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, user) => {
            if (err) {
                console.error('Error querying user:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error en el servidor' 
                });
            }

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Usuario o contraseña incorrectos' 
                });
            }

            try {
                // Compare password
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Usuario o contraseña incorrectos' 
                    });
                }

                // Set session
                req.session.userId = user.id;
                req.session.username = user.username;

                res.json({ 
                    success: true, 
                    message: 'Inicio de sesión exitoso',
                    redirect: '/'
                });
            } catch (error) {
                console.error('Error comparing password:', error);
                res.status(500).json({ 
                    success: false, 
                    message: 'Error en el servidor' 
                });
            }
        }
    );
});

// User logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar sesión' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Sesión cerrada exitosamente' 
        });
    });
});

// Check authentication status
app.get('/auth/status', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            authenticated: true, 
            username: req.session.username 
        });
    } else {
        res.json({ 
            authenticated: false 
        });
    }
});

// Save subscription information
app.post('/subscription', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Debe iniciar sesión primero' 
        });
    }

    const { preapproval_id, status } = req.body;

    db.run(
        'INSERT INTO subscriptions (user_id, preapproval_id, status) VALUES (?, ?, ?)',
        [req.session.userId, preapproval_id || null, status || 'pending'],
        function(err) {
            if (err) {
                console.error('Error saving subscription:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al guardar suscripción' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Suscripción guardada exitosamente' 
            });
        }
    );
});

// Get user's subscriptions
app.get('/subscriptions', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Debe iniciar sesión primero' 
        });
    }

    db.all(
        'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC',
        [req.session.userId],
        (err, subscriptions) => {
            if (err) {
                console.error('Error querying subscriptions:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al obtener suscripciones' 
                });
            }

            res.json({ 
                success: true, 
                subscriptions 
            });
        }
    );
});

// Admin route - Get all users (requires authentication)
app.get('/admin/users', (req, res) => {
    // In production, add proper admin authentication
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'No autorizado' 
        });
    }

    db.all(
        'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC',
        (err, users) => {
            if (err) {
                console.error('Error querying users:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al obtener usuarios' 
                });
            }

            res.json({ 
                success: true, 
                users 
            });
        }
    );
});

// Admin route - Get all subscriptions (requires authentication)
app.get('/admin/subscriptions', (req, res) => {
    // In production, add proper admin authentication
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'No autorizado' 
        });
    }

    db.all(
        `SELECT s.*, u.username, u.email 
         FROM subscriptions s 
         JOIN users u ON s.user_id = u.id 
         ORDER BY s.created_at DESC`,
        (err, subscriptions) => {
            if (err) {
                console.error('Error querying subscriptions:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al obtener suscripciones' 
                });
            }

            res.json({ 
                success: true, 
                subscriptions 
            });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`AURA STUDIO server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
