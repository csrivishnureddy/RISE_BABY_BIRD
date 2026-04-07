// Enhanced Global Scripts with Dark/Light Mode Support

document.addEventListener("DOMContentLoaded", function () {
    // Theme management
    const themeToggleDesktop = document.getElementById("themeToggle");
    const themeIconDesktop = document.getElementById("themeIcon");
    const themeToggleMobile = document.getElementById("themeToggleMobile");
    const themeIconMobile = document.getElementById("themeIconMobile");
    const body = document.body;

    // Get initial theme from localStorage or system preference
    function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark-mode';
        }
        
        return 'light-mode';
    }

    // Apply theme
    function applyTheme(theme) {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme);
        
        // Update icons
        if (themeIconDesktop && themeIconMobile) {
            if (theme === 'dark-mode') {
                themeIconDesktop.classList.remove('fa-moon');
                themeIconDesktop.classList.add('fa-sun');
                themeIconMobile.classList.remove('fa-moon');
                themeIconMobile.classList.add('fa-sun');
            } else {
                themeIconDesktop.classList.remove('fa-sun');
                themeIconDesktop.classList.add('fa-moon');
                themeIconMobile.classList.remove('fa-sun');
                themeIconMobile.classList.add('fa-moon');
            }
        }
        
        // Update CSS custom properties
        updateCSSProperties(theme);
        
        // Store preference
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Update CSS custom properties based on theme
    function updateCSSProperties(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark-mode') {
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--bg-tertiary', '#334155');
            root.style.setProperty('--text-primary', '#f1f5f9');
            root.style.setProperty('--text-secondary', '#cbd5e1');
            root.style.setProperty('--text-muted', '#94a3b8');
            root.style.setProperty('--border-color', '#475569');
            root.style.setProperty('--card-bg', '#1e293b');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--bg-tertiary', '#f1f5f9');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#475569');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
        }
    }

    // Toggle theme function
    function toggleTheme() {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        applyTheme(newTheme);
        
        // Add smooth transition effect
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    // Initialize theme
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    // Add event listeners for theme toggles
    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark-mode' : 'light-mode');
            }
        });
    }

    // Enhanced Offcanvas menu logic
    const hamburger = document.getElementById('hamburger-icon');
    const offcanvas = document.getElementById('offcanvas-menu');
    const closeMenu = document.getElementById('close-menu');
    const offcanvasOverlay = document.createElement('div');
    
    // Create overlay for mobile menu
    offcanvasOverlay.className = 'offcanvas-overlay fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
    document.body.appendChild(offcanvasOverlay);

    function openOffcanvas() {
        if (offcanvas) {
            offcanvas.classList.remove('translate-x-full');
            offcanvas.classList.add('translate-x-0');
            offcanvasOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Add animation class
            offcanvas.style.transition = 'transform 0.3s ease-in-out';
            
            // Focus management for accessibility
            const firstFocusableElement = offcanvas.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }
    }

    function closeOffcanvas() {
        if (offcanvas) {
            offcanvas.classList.add('translate-x-full');
            offcanvas.classList.remove('translate-x-0');
            offcanvasOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Return focus to hamburger button
            if (hamburger) {
                hamburger.focus();
            }
        }
    }

    // Event listeners for offcanvas
    if (hamburger) {
        hamburger.addEventListener('click', openOffcanvas);
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeOffcanvas);
    }

    // Close offcanvas when clicking overlay
    offcanvasOverlay.addEventListener('click', closeOffcanvas);

    // Close offcanvas when clicking menu links
    if (offcanvas) {
        const menuLinks = offcanvas.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeOffcanvas);
        });
    }

    // Keyboard navigation for offcanvas
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offcanvas && !offcanvas.classList.contains('translate-x-full')) {
            closeOffcanvas();
        }
    });

    // Enhanced navbar scroll behavior
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;
    let isScrolling = false;

    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
                navbar.style.backgroundColor = 'var(--card-bg)';
                navbar.style.boxShadow = '0 2px 20px var(--shadow-color)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.borderBottom = '1px solid var(--border-color)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.backgroundColor = 'transparent';
                navbar.style.boxShadow = 'none';
                navbar.style.backdropFilter = 'none';
                navbar.style.borderBottom = 'none';
            }

            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        isScrolling = false;
    }

    // Debounced scroll handler
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedScrollHandler = debounce(handleNavbarScroll, 10);
    window.addEventListener('scroll', debouncedScrollHandler);

    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (target) {
            e.preventDefault();
            const targetId = target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - (navbar ? navbar.offsetHeight : 0);
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeOffcanvas();
            }
        }
    });

    // Loading state management
    function showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        }
    }

    function hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    // Global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // You can add error reporting here
    });

    // Global unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // You can add error reporting here
    });

    // Accessibility improvements
    function improveAccessibility() {
        // Add skip link if not present
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Improve focus visibility
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // Add focus-visible polyfill behavior
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Initialize accessibility improvements
    improveAccessibility();

    // Performance monitoring
    function measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                        console.log('DOM content loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                    }
                }, 0);
            });
        }
    }

    // Initialize performance monitoring
    measurePerformance();

    // Utility functions for global use
    window.RetouchUtils = {
        showLoading,
        hideLoading,
        debounce,
        toggleTheme,
        openOffcanvas,
        closeOffcanvas
    };

    // Initialize tooltips if library is available
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]', {
            theme: body.classList.contains('dark-mode') ? 'dark' : 'light'
        });

        // Update tooltip theme when theme changes
        window.addEventListener('themeChanged', function(e) {
            const instances = tippy.instances;
            instances.forEach(instance => {
                instance.setProps({
                    theme: e.detail.theme === 'dark-mode' ? 'dark' : 'light'
                });
            });
        });
    }

    // Service Worker registration for PWA support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }

    // Initialize intersection observer for lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Handle lazy loading for images
                if (element.tagName === 'IMG' && element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                    element.classList.remove('lazy');
                }
                
                // Handle lazy loading for background images
                if (element.dataset.bgSrc) {
                    element.style.backgroundImage = `url(${element.dataset.bgSrc})`;
                    element.removeAttribute('data-bg-src');
                }
                
                lazyLoadObserver.unobserve(element);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe all lazy load elements
    document.querySelectorAll('[data-src], [data-bg-src]').forEach(el => {
        lazyLoadObserver.observe(el);
    });

    console.log('Global scripts initialized successfully');
});

// Global utility functions available outside DOMContentLoaded
window.RetouchGlobal = {
    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date
    formatDate: function(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: function(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\s/g, ''));
    },

    // Get theme
    getTheme: function() {
        return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    },

    // Show notification
    showNotification: function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${message}</span>
                <button class="ml-auto text-lg" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
};