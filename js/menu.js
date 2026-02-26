/*
 * Funcionalidad del Menú Hamburguesa
 * - Toggle para mostrar/ocultar menú
 * - Navegación a modales de registro y login
 * - Botón de logout visible solo cuando hay sesión activa
 * - Accesibilidad con ARIA labels
 * - Responsive y funcional en móviles
 */

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuDropdown = document.getElementById('menu-dropdown');
    const menuRegister = document.getElementById('menu-register');
    const menuMyClasses = document.getElementById('menu-my-classes');
    const menuAdminLogin = document.getElementById('menu-admin-login');
    const menuLogout = document.getElementById('menu-logout');
    
    const registerModal = document.getElementById('register-modal');
    const userLoginModal = document.getElementById('user-login-modal');
    const userLoginCancel = document.getElementById('user-login-cancel');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminLoginCancel = document.getElementById('admin-login-cancel');
    
    // Toggle hamburger menu
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = menuDropdown.style.display === 'block';
        menuDropdown.style.display = isOpen ? 'none' : 'block';
        hamburgerBtn.setAttribute('aria-expanded', !isOpen);
        menuDropdown.setAttribute('aria-hidden', isOpen);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
            menuDropdown.style.display = 'none';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            menuDropdown.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Hover effects for menu items
    const menuItems = [menuRegister, menuMyClasses, menuAdminLogin, menuLogout];
    const menuBack = document.getElementById('menu-back');
    if (menuBack) {
        menuItems.push(menuBack);
    }
    menuItems.forEach(item => {
        if (item) {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'linear-gradient(135deg, #EFE9E1 0%, #EFE9E1 100%)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
        }
    });
    
    // Show register modal
    menuRegister.addEventListener('click', () => {
        menuDropdown.style.display = 'none';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        menuDropdown.setAttribute('aria-hidden', 'true');
        registerModal.style.display = 'flex';
        document.getElementById('quick-name').focus();
    });
    
    // Show user login modal (Iniciar Sesión)
    menuMyClasses.addEventListener('click', () => {
        menuDropdown.style.display = 'none';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        menuDropdown.setAttribute('aria-hidden', 'true');
        userLoginModal.style.display = 'flex';
        document.getElementById('user-login-phone').focus();
    });
    
    // Handle "Volver Atrás" button - go back to main page
    if (menuBack) {
        menuBack.addEventListener('click', () => {
            menuDropdown.style.display = 'none';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            menuDropdown.setAttribute('aria-hidden', 'true');
            
            // Show all sections again
            if (typeof window.showAllSectionsExceptAdmin === 'function') {
                window.showAllSectionsExceptAdmin();
            }
            
            // Hide "Mis Clases" section
            hideUserClasses();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Close user login modal
    userLoginCancel.addEventListener('click', () => {
        userLoginModal.style.display = 'none';
        document.getElementById('user-login-form').reset();
        document.getElementById('user-login-error').style.display = 'none';
    });
    
    // Close user login modal when clicking outside
    userLoginModal.addEventListener('click', (e) => {
        if (e.target === userLoginModal) {
            userLoginModal.style.display = 'none';
            document.getElementById('user-login-form').reset();
            document.getElementById('user-login-error').style.display = 'none';
        }
    });
    
    // Handle user login form submission (Mis Clases)
    document.getElementById('user-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phoneDigits = document.getElementById('user-login-phone').value.trim();
        const errorDiv = document.getElementById('user-login-error');
        
        // Validate phone number
        if (!phoneDigits || !/^\d{10}$/.test(phoneDigits)) {
            errorDiv.textContent = '⚠️ Ingresa 10 dígitos del teléfono';
            errorDiv.style.display = 'block';
            return;
        }
        
        const phoneWithCountryCode = '+52' + phoneDigits;
        
        // Check if Firebase is ready
        if (!window.firebaseReady || !window.auth) {
            errorDiv.textContent = '⚠️ Sistema inicializando. Por favor, espera unos segundos e intenta nuevamente.';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Use Firebase Phone Authentication
        try {
            const { signInWithPhoneNumber, RecaptchaVerifier } = window.firebaseAuthExports || {};
            
            if (!signInWithPhoneNumber || !RecaptchaVerifier) {
                console.error('❌ Firebase Auth functions not available');
                throw new Error('Sistema de autenticación no disponible');
            }
            
            // Ensure reCAPTCHA verifier exists - reuse global instance
            if (!window.recaptchaVerifier) {
                console.error('❌ reCAPTCHA verifier no está inicializado');
                throw new Error('Sistema de autenticación no está listo. Por favor, espera unos segundos e intenta nuevamente.');
            }
            
            // console.log('✅ Usando reCAPTCHA verifier global existente');
            
            // console.log('📱 Enviando código de verificación para login:', phoneWithCountryCode);
            
            // Send verification code
            const confirmationResult = await signInWithPhoneNumber(window.auth, phoneWithCountryCode, window.recaptchaVerifier);
            
            // Store confirmation result and phone data for verification step
            window.phoneLoginData = {
                confirmationResult,
                phoneDigits,
                phoneWithCountryCode
            };
            
            // console.log('✅ Código enviado para login');
            
            // Hide login modal
            userLoginModal.style.display = 'none';
            document.getElementById('user-login-form').reset();
            errorDiv.style.display = 'none';
            
            // Show verification code modal for login
            document.getElementById('verification-code-modal-login').style.display = 'flex';
            document.getElementById('verification-code-input-login').focus();
            
        } catch (error) {
            console.error('Error during user login:', error);
            
            // Handle Firebase Authentication errors
            let errorMessage = '❌ ';
            
            if (error.code === 'auth/invalid-phone-number') {
                errorMessage += 'Número de teléfono no válido. Verifica que sea correcto.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage += 'Demasiados intentos. Por favor, espera unos minutos e intenta nuevamente.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage += 'Error de conexión. Verifica tu internet e intenta nuevamente.';
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Error al enviar código. Intenta nuevamente.';
            }
            
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
            
            // Note: We don't clear the reCAPTCHA verifier on error
            // to allow the user to retry without reloading the page.
            // The global verifier will be reused on the next attempt.
        }
    });
    
    // ========== PHONE VERIFICATION HANDLERS FOR LOGIN ==========
    
    const verifyBtnLogin = document.getElementById('verify-code-btn-login');
    const cancelBtnLogin = document.getElementById('cancel-verification-btn-login');
    const resendBtnLogin = document.getElementById('resend-code-btn-login');
    const codeInputLogin = document.getElementById('verification-code-input-login');
    const errorDivLogin = document.getElementById('verification-error-login');
    const modalLogin = document.getElementById('verification-code-modal-login');
    
    if (verifyBtnLogin) {
        verifyBtnLogin.addEventListener('click', async () => {
            const code = codeInputLogin.value.trim();
            
            if (!code || code.length !== 6) {
                errorDivLogin.textContent = '⚠️ Ingresa el código de 6 dígitos';
                errorDivLogin.style.display = 'block';
                return;
            }
            
            if (!window.phoneLoginData || !window.phoneLoginData.confirmationResult) {
                errorDivLogin.textContent = '❌ Error: Sesión expirada. Por favor, intenta iniciar sesión nuevamente.';
                errorDivLogin.style.display = 'block';
                return;
            }
            
            try {
                // console.log('🔐 Verificando código de login...');
                
                // Verify the code
                const result = await window.phoneLoginData.confirmationResult.confirm(code);
                const user = result.user;
                
                // console.log('✅ Login exitoso! UID:', user.uid);
                // console.log('📱 Teléfono:', user.phoneNumber);
                
                // Get user data
                const { phoneDigits, phoneWithCountryCode } = window.phoneLoginData;
                const userName = localStorage.getItem('userName_' + phoneDigits) || 'Usuario';
                
                // Store user info in localStorage
                localStorage.setItem('userNombre', userName);
                localStorage.setItem('userTelefono', phoneWithCountryCode);
                localStorage.setItem('userLoggedIn', 'true');
                
                // Close verification modal
                modalLogin.style.display = 'none';
                codeInputLogin.value = '';
                errorDivLogin.style.display = 'none';
                
                // Clear login data
                window.phoneLoginData = null;
                
                // Update UI for logged in user
                if (typeof window.updateUIForLoggedInUser === 'function') {
                    window.updateUIForLoggedInUser();
                }
                
                // Load user's classes
                if (typeof window.loadUserClasses === 'function') {
                    await window.loadUserClasses(phoneWithCountryCode);
                    
                    // Scroll to My Classes section
                    const myClassesSection = document.getElementById('my-classes-section');
                    if (myClassesSection) {
                        setTimeout(() => {
                            myClassesSection.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }
                }
                
            } catch (error) {
                console.error('❌ Error al verificar código de login:', error);
                
                let errorMessage = '❌ ';
                if (error.code === 'auth/invalid-verification-code') {
                    errorMessage += 'Código incorrecto. Verifica e intenta nuevamente.';
                } else if (error.code === 'auth/code-expired') {
                    errorMessage += 'Código expirado. Por favor, solicita un nuevo código.';
                } else if (error.message) {
                    errorMessage += error.message;
                } else {
                    errorMessage += 'Error al verificar código. Intenta nuevamente.';
                }
                
                errorDivLogin.textContent = errorMessage;
                errorDivLogin.style.display = 'block';
            }
        });
    }
    
    if (cancelBtnLogin) {
        cancelBtnLogin.addEventListener('click', () => {
            modalLogin.style.display = 'none';
            codeInputLogin.value = '';
            errorDivLogin.style.display = 'none';
            window.phoneLoginData = null;
            
            // Show login modal again
            userLoginModal.style.display = 'flex';
        });
    }
    
    if (resendBtnLogin) {
        resendBtnLogin.addEventListener('click', async () => {
            if (!window.phoneLoginData) {
                errorDivLogin.textContent = '❌ Error: Sesión expirada. Por favor, cierra e intenta iniciar sesión nuevamente.';
                errorDivLogin.style.display = 'block';
                return;
            }
            
            try {
                const { phoneWithCountryCode } = window.phoneLoginData;
                
                // Ensure reCAPTCHA verifier exists - reuse global instance
                if (!window.recaptchaVerifier) {
                    console.error('❌ reCAPTCHA verifier no está inicializado');
                    errorDivLogin.textContent = '❌ Error: Sistema no está listo. Por favor, espera unos segundos e intenta nuevamente.';
                    errorDivLogin.style.display = 'block';
                    return;
                }
                
                // console.log('📱 Reenviando código de login a:', phoneWithCountryCode);
                // console.log('✅ Usando reCAPTCHA verifier global existente');
                
                // Resend code
                const { signInWithPhoneNumber } = window.firebaseAuthExports || {};
                const confirmationResult = await signInWithPhoneNumber(window.auth, phoneWithCountryCode, window.recaptchaVerifier);
                
                // Update confirmation result
                window.phoneLoginData.confirmationResult = confirmationResult;
                
                // console.log('✅ Código reenviado');
                errorDivLogin.textContent = '✅ Código reenviado exitosamente';
                errorDivLogin.style.display = 'block';
                errorDivLogin.style.background = 'rgba(76, 175, 80, 0.1)';
                errorDivLogin.style.color = '#4CAF50';
                
                // Reset error styling after 3 seconds
                setTimeout(() => {
                    errorDivLogin.style.display = 'none';
                    errorDivLogin.style.background = 'rgba(197, 17, 98, 0.1)';
                    errorDivLogin.style.color = '#C51162';
                }, 3000);
                
            } catch (error) {
                console.error('❌ Error al reenviar código:', error);
                errorDivLogin.textContent = '❌ Error al reenviar código. Intenta nuevamente.';
                errorDivLogin.style.display = 'block';
            }
        });
    }
    
    // Password visibility toggle for registration form
    const toggleRegisterPassword = document.getElementById('toggle-register-password');
    const registerPasswordInput = document.getElementById('quick-password');
    if (toggleRegisterPassword && registerPasswordInput) {
        toggleRegisterPassword.addEventListener('click', () => {
            const type = registerPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            registerPasswordInput.setAttribute('type', type);
            // Toggle icon between eye and eye-slash
            toggleRegisterPassword.textContent = type === 'password' ? '👁️' : '🙈';
            toggleRegisterPassword.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        });
    }
    
    // Password visibility toggle for login form
    const toggleLoginPassword = document.getElementById('toggle-login-password');
    const loginPasswordInput = document.getElementById('user-login-password');
    if (toggleLoginPassword && loginPasswordInput) {
        toggleLoginPassword.addEventListener('click', () => {
            const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPasswordInput.setAttribute('type', type);
            // Toggle icon between eye and eye-slash
            toggleLoginPassword.textContent = type === 'password' ? '👁️' : '🙈';
            toggleLoginPassword.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        });
    }
    
    // Password visibility toggle for reservation modal
    const toggleReservationPassword = document.getElementById('toggle-reservation-password');
    const reservationPasswordInput = document.getElementById('reservation-password');
    if (toggleReservationPassword && reservationPasswordInput) {
        toggleReservationPassword.addEventListener('click', () => {
            const type = reservationPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            reservationPasswordInput.setAttribute('type', type);
            // Toggle icon between eye and eye-slash
            toggleReservationPassword.textContent = type === 'password' ? '👁️' : '🙈';
            toggleReservationPassword.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        });
    }
    
    // Password visibility toggle for legacy password modal
    const toggleLegacyPassword = document.getElementById('toggle-legacy-password');
    const legacyPasswordInput = document.getElementById('legacy-new-password');
    if (toggleLegacyPassword && legacyPasswordInput) {
        toggleLegacyPassword.addEventListener('click', () => {
            const type = legacyPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            legacyPasswordInput.setAttribute('type', type);
            // Toggle icon between eye and eye-slash
            toggleLegacyPassword.textContent = type === 'password' ? '👁️' : '🙈';
            toggleLegacyPassword.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        });
    }
    
    // Setup legacy password creation modal handlers
    const legacyPasswordModal = document.getElementById('create-password-modal');
    const legacyPasswordConfirm = document.getElementById('legacy-password-confirm');
    const legacyPasswordCancel = document.getElementById('legacy-password-cancel');
    const legacyPasswordError = document.getElementById('legacy-password-error');
    
    if (legacyPasswordCancel) {
        legacyPasswordCancel.addEventListener('click', () => {
            legacyPasswordModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            legacyPasswordInput.value = '';
            legacyPasswordError.style.display = 'none';
        });
    }
    
    // Close legacy password modal on background click
    if (legacyPasswordModal) {
        legacyPasswordModal.addEventListener('click', (e) => {
            if (e.target === legacyPasswordModal) {
                legacyPasswordModal.style.display = 'none';
                document.body.classList.remove('modal-open');
                legacyPasswordInput.value = '';
                legacyPasswordError.style.display = 'none';
            }
        });
    }
    
    // Show admin login modal
    menuAdminLogin.addEventListener('click', () => {
        menuDropdown.style.display = 'none';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        menuDropdown.setAttribute('aria-hidden', 'true');
        adminLoginModal.style.display = 'flex';
        document.body.classList.add('modal-open');
        document.getElementById('admin-email').focus();
    });
    
    // Close admin login modal
    adminLoginCancel.addEventListener('click', () => {
        adminLoginModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.getElementById('admin-login-form').reset();
        document.getElementById('login-error').style.display = 'none';
    });
    
    // Close time selection modal
    const timeCancel = document.getElementById('time-cancel');
    const timeModal = document.getElementById('time-selection-modal');
    
    timeCancel.addEventListener('click', () => {
        // Clear the time slots container to prevent any potential duplication issues
        const slotsContainer = document.getElementById('time-slots-container');
        if (slotsContainer) {
            slotsContainer.innerHTML = '';
        }
        timeModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    });

    // ========== Reglamento Modal Functionality ==========
    const reglamentoLink = document.getElementById('reglamento-link');
    const reglamentoModal = document.getElementById('reglamento-modal');
    const reglamentoClose = document.getElementById('reglamento-close');

    // Open reglamento modal
    reglamentoLink.addEventListener('click', () => {
        reglamentoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close reglamento modal
    reglamentoClose.addEventListener('click', () => {
        reglamentoModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside the content
    reglamentoModal.addEventListener('click', (e) => {
        if (e.target === reglamentoModal) {
            reglamentoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reglamentoModal.style.display === 'flex') {
            reglamentoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modals on ESC key
    const reservationModal = document.getElementById('reservation-modal');
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Check if time-selection-modal or reservation-modal is visible before closing
            if (timeModal.style.display === 'flex' || reservationModal.style.display === 'flex') {
                document.body.style.overflow = ''; // Restore scrolling
                // Clear the time slots container when closing
                const slotsContainer = document.getElementById('time-slots-container');
                if (slotsContainer && timeModal.style.display === 'flex') {
                    slotsContainer.innerHTML = '';
                }
            }
            registerModal.style.display = 'none';
            // Reset user login modal when closing with ESC
            if (userLoginModal.style.display === 'flex') {
                document.getElementById('user-login-form').reset();
                document.getElementById('user-login-error').style.display = 'none';
            }
            userLoginModal.style.display = 'none';
            adminLoginModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            timeModal.style.display = 'none';
            reservationModal.style.display = 'none';
            menuDropdown.style.display = 'none';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            menuDropdown.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close modals when clicking outside
    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
            // Clear input fields
            document.getElementById('quick-name').value = '';
            document.getElementById('quick-phone-digits').value = '';
            document.getElementById('quick-password').value = '';
        }
    });
    
    adminLoginModal.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            document.getElementById('admin-login-form').reset();
            document.getElementById('login-error').style.display = 'none';
        }
    });
    
    timeModal.addEventListener('click', (e) => {
        if (e.target === timeModal) {
            timeModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close reservation modal when clicking outside
    reservationModal.addEventListener('click', (e) => {
        if (e.target === reservationModal) {
            reservationModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Hover effects for buttons
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(btn => {
        if (btn.style.background && btn.style.background.includes('f6c8c7')) {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 8px 20px rgba(239, 233, 225, 0.5)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 15px rgba(239, 233, 225, 0.3)';
            });
        }
    });
    
    // Hover effect for hamburger button
    hamburgerBtn.addEventListener('mouseenter', () => {
        hamburgerBtn.style.transform = 'scale(1.1)';
        hamburgerBtn.style.transition = 'transform 0.2s ease';
    });
    hamburgerBtn.addEventListener('mouseleave', () => {
        hamburgerBtn.style.transform = 'scale(1)';
    });
});

/**
 * Hide My Classes section
 * (Global function referenced by other scripts)
 */
function hideUserClasses() {
    const myClassesSection = document.getElementById('my-classes-section');
    const greetingEl = document.getElementById('my-classes-greeting');
    if (myClassesSection) {
        myClassesSection.style.display = 'none';
    }
    // Reset greeting to default
    if (greetingEl) {
        greetingEl.textContent = 'Mis Clases';
    }
}
