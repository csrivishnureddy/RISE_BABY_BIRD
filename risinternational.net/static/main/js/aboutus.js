// About Us Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('About Us page loaded');
    
    // Initialize mobile optimizations first
    initMobileOptimizations();
    
    // Then initialize other functions
    initScrollAnimations();
    initTeamCarousel();
    initCounterAnimations();
    initRotatingText();
    initSmoothScrolling();
    initParallaxEffects();
    initValuesAnimation();
    initServicesProAnimation();
    
    console.log('All functions initialized');
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation if it's a counter element
                if (entry.target.querySelector('.counter')) {
                    animateCounters(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Team Carousel
function initTeamCarousel() {
    const carousel = document.querySelector('.team-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.team-card');
    if (!carousel || !prevBtn || !nextBtn || cards.length === 0) {
        console.log('Carousel elements not found');
        return;
    }

    let currentIndex = 0;
    let cardWidth = 320;
    let visibleCards = 1;
    let maxIndex = 0;

    function calculateDimensions() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            cardWidth = 320 + 32;
            visibleCards = 3;
        } else if (screenWidth >= 768) {
            cardWidth = 300 + 20;
            visibleCards = 2;
        } else {
            cardWidth = 280 + 16;
            visibleCards = 1;
        }
        maxIndex = Math.max(0, cards.length - visibleCards);
    }

    function updateCarousel() {
        calculateDimensions();
        const translateX = -currentIndex * cardWidth;
        carousel.style.transform = `translateX(${translateX}px)`;
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    let autoPlayInterval;
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 4000); // 4 seconds, adjust as needed
    }
    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
        stopAutoPlay();
        setTimeout(startAutoPlay, 4000);
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        } else {
            currentIndex = 0;
            updateCarousel();
        }
        stopAutoPlay();
        setTimeout(startAutoPlay, 4000);
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
        carousel.style.transition = 'none';
    }, { passive: true });
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        const currentTranslateX = -currentIndex * cardWidth;
        carousel.style.transform = `translateX(${currentTranslateX - diff}px)`;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < maxIndex) {
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
            }
        }
        updateCarousel();
        isDragging = false;
        setTimeout(startAutoPlay, 4000);
    }, { passive: true });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    window.addEventListener('resize', () => {
        calculateDimensions();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateCarousel();
    });

    // Initialize
    calculateDimensions();
    updateCarousel();
    startAutoPlay();
}

// Counter Animations
function initCounterAnimations() {
    // This will be called when the statistics section comes into view
}

function animateCounters(section) {
    const counters = section.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Rotating Text Animation
function initRotatingText() {
    const rotatingText = document.querySelector('.rotating-text');
    if (!rotatingText) return;
    
    const texts = [
        'Customer Relationship Management',
        'Web Development',
        'AI Solutions',
        'Technical Services',
        'Digital Marketing',
        'Cloud Solutions'
    ];
    
    const colors = ['#ff6f61', '#0f0fcb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    
    let currentIndex = 0;
    
    function updateText() {
        rotatingText.style.opacity = '0';
        rotatingText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            rotatingText.textContent = texts[currentIndex];
            rotatingText.style.color = colors[currentIndex];
            rotatingText.style.opacity = '1';
            rotatingText.style.transform = 'translateY(0)';
            
            currentIndex = (currentIndex + 1) % texts.length;
        }, 300);
    }
    
    // Initial setup
    rotatingText.style.transition = 'all 0.3s ease';
    
    // Start rotation
    setInterval(updateText, 3000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-shape');
    
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Performance Optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    };
    
    // Preload critical images
    const criticalImages = [
        '/static/main/images/aboutus.jpg',
        '/static/main/images/quality.png',
        '/static/main/images/ourteam.jpeg',
        '/static/main/images/commitment.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('About Us Page Error:', e.error);
    // You can add error reporting here
});

// Initialize performance optimizations
optimizePerformance();

// Accessibility Enhancements
document.addEventListener('keydown', (e) => {
    // ESC key to stop animations for accessibility
    if (e.key === 'Escape') {
        document.querySelectorAll('.floating-shape').forEach(shape => {
            shape.style.animation = 'none';
        });
    }
});

// Reduced Motion Support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.querySelectorAll('.floating-shape').forEach(shape => {
        shape.style.animation = 'none';
    });
}

// Services Pro section scroll animation
function initServicesProAnimation() {
    const serviceCards = document.querySelectorAll('.service-pro-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    serviceCards.forEach(card => {
        observer.observe(card);
    });
}

// Enhanced mobile optimizations
function initMobileOptimizations() {
    // Ensure carousel is visible on all devices
    const carousel = document.querySelector('.team-carousel');
    const carouselContainer = document.querySelector('#team');
    
    if (carousel) {
        carousel.style.display = 'flex';
        carousel.style.visibility = 'visible';
        carousel.style.opacity = '1';
    }
    
    if (carouselContainer) {
        carouselContainer.style.display = 'block';
        carouselContainer.style.visibility = 'visible';
        carouselContainer.style.opacity = '1';
    }
    
    // Force show carousel buttons on mobile
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.style.display = 'flex';
        prevBtn.style.visibility = 'visible';
    }
    
    if (nextBtn) {
        nextBtn.style.display = 'flex';
        nextBtn.style.visibility = 'visible';
    }
}

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        initMobileOptimizations();
        // Recalculate carousel if needed
        // updateCarousel is now inside initTeamCarousel, so we can't call it here
        // Instead, re-initialize the carousel if needed
        initTeamCarousel();
    }, 100);
});