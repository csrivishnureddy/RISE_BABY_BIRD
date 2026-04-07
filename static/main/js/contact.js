// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact form JavaScript loaded');
    
    const form = document.getElementById('contactForm');
    if (!form) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Contact form found, initializing...');
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        console.log('Form data:', data);
        
        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            showMessage('error', 'Please fill in all required fields.');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        if (btnText) btnText.classList.add('hidden');
        if (btnLoader) btnLoader.classList.remove('hidden');
        
        try {
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            console.log('Sending request to server...');
            
            // Submit form
            const response = await fetch('/contact/', {
                method: 'POST',
                body: new URLSearchParams(new FormData(form)),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });
            
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                showMessage('success', result.message);
                form.reset();
                // Reset checkboxes
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                    updateCheckbox(cb);
                });
            } else {
                showMessage('error', result.message);
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');
        }
    });
    
    // Show message function
    function showMessage(type, message) {
        console.log(`Showing ${type} message:`, message);
        
        // Try existing message containers first
        const messagesContainer = document.getElementById('form-messages');
        const messageElement = document.getElementById(`${type}-message`);
        
        if (messageElement && messagesContainer) {
            // Hide all messages
            messagesContainer.querySelectorAll('[id$="-message"]').forEach(msg => {
                msg.classList.add('hidden');
            });
            
            // Update message text
            const messageText = messageElement.querySelector('p');
            if (messageText) {
                messageText.textContent = message;
            }
            
            // Show message
            messagesContainer.classList.remove('hidden');
            messageElement.classList.remove('hidden');
            
            // Scroll to message
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                messageElement.classList.add('hidden');
                messagesContainer.classList.add('hidden');
            }, 8000);
        } else {
            // Fallback: Create popup
            createPopup(type, message);
        }
    }
    
    // Create popup fallback
    function createPopup(type, message) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const isSuccess = type === 'success';
        const iconClass = isSuccess ? 'fas fa-check text-green-500' : 'fas fa-exclamation-triangle text-red-500';
        const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
        const btnColor = isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
        const title = isSuccess ? 'Success!' : 'Error';
        
        popup.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
                <div class="w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="${iconClass} text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="this.closest('.fixed').remove()" class="${btnColor} text-white px-6 py-2 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
    }
    
    // Handle checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCheckbox(this);
        });
        updateCheckbox(checkbox); // Initial state
    });
    
    function updateCheckbox(checkbox) {
        const customCheckbox = checkbox.nextElementSibling;
        if (!customCheckbox) return;
        
        const checkIcon = customCheckbox.querySelector('i');
        if (!checkIcon) return;
        
        if (checkbox.checked) {
            customCheckbox.style.backgroundColor = '#0f0fcb';
            customCheckbox.style.borderColor = '#0f0fcb';
            checkIcon.style.opacity = '1';
        } else {
            customCheckbox.style.backgroundColor = '';
            customCheckbox.style.borderColor = '';
            checkIcon.style.opacity = '0';
        }
    }
});

// FAQ toggle function (if needed)
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('show');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherButton = item.querySelector('.faq-question');
            const otherIcon = item.querySelector('.faq-icon');
            
            if (otherAnswer) otherAnswer.classList.remove('show');
            if (otherButton) otherButton.classList.remove('active');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ
    if (isOpen) {
        answer.classList.remove('show');
        button.classList.remove('active');
        icon.style.transform = 'rotate(0deg)';
    } else {
        answer.classList.add('show');
        button.classList.add('active');
        icon.style.transform = 'rotate(45deg)';
    }
}

// Example: team-carousel.js
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".team-carousel");
    const slides = document.querySelectorAll(".team-slide");
    const nextBtn = document.getElementById("team-next");
    const prevBtn = document.getElementById("team-prev");

    if (!carousel || slides.length === 0) return;

    let currentIndex = 0;
    let slideWidth = slides[0].offsetWidth;
    let autoPlayId = null;
    const interval = 13000;

    // Lazy load images
    function lazyLoadSlide(index) {
        const img = slides[index]?.querySelector("img[data-src]");
        if (img && !img.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
        }
    }

    function calculateDimensions() {
        slideWidth = slides[0].offsetWidth;
    }

    function updateCarousel() {
        carousel.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        // Lazy load current, previous, and next slides
        lazyLoadSlide(currentIndex);
        lazyLoadSlide((currentIndex + 1) % slides.length);
        lazyLoadSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateCarousel();
    }

    function advanceCarousel() {
        goToSlide(currentIndex + 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayId = setInterval(advanceCarousel, interval);
    }

    function stopAutoPlay() {
        if (autoPlayId) clearInterval(autoPlayId);
        autoPlayId = null;
    }

    // Arrow buttons
    nextBtn?.addEventListener("click", () => {
        stopAutoPlay();
        goToSlide(currentIndex + 1);
        setTimeout(startAutoPlay, 3000);
    });

    prevBtn?.addEventListener("click", () => {
        stopAutoPlay();
        goToSlide(currentIndex - 1);
        setTimeout(startAutoPlay, 3000);
    });

    // Resize handler
    window.addEventListener("resize", () => {
        calculateDimensions();
        updateCarousel();
    });

    // Touch swipe for mobile
    let startX = 0;
    let isSwiping = false;

    carousel.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            isSwiping = true;
            stopAutoPlay();
        }
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
        if (isSwiping) e.preventDefault();
    }, { passive: false });

    carousel.addEventListener("touchend", (e) => {
        if (!isSwiping) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentIndex - 1); // swipe right
            } else {
                goToSlide(currentIndex + 1); // swipe left
            }
        }
        isSwiping = false;
        setTimeout(startAutoPlay, 3000);
    });

    // Pause on hover (desktop)
    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    // Init
    calculateDimensions();
    updateCarousel();
    startAutoPlay();
});

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.team-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cards = document.querySelectorAll('.team-card');
    if (!carousel || cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // w-80 + mx-4 (320+32=352)
    let visibleCards = Math.floor(carousel.offsetWidth / cardWidth) || 1;
    let maxIndex = Math.max(0, cards.length - visibleCards);

    function updateCarousel() {
        const translateX = -currentIndex * cardWidth;
        carousel.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
        carousel.style.transform = `translateX(${translateX}px)`;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        } else {
            currentIndex = 0; // Loop to start
            updateCarousel();
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Handle window resize
    function handleResize() {
        visibleCards = Math.floor(carousel.offsetWidth / cardWidth) || 1;
        maxIndex = Math.max(0, cards.length - visibleCards);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateCarousel();
    }
    window.addEventListener('resize', handleResize);

    // Touch/swipe support (mobile)
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // Prevent scrolling while swiping carousel
        e.preventDefault();
    }, { passive: false });

    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;
        if (Math.abs(diffX) > 50) {
            if (diffX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        isDragging = false;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'ArrowRight') nextSlide();
    });

    // Auto-scroll functionality
    let autoScrollInterval;
    function startAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(nextSlide, 4000);
    }
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Pause auto-scroll on hover (desktop)
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);

    // Initialize
    handleResize();
    updateCarousel();
    startAutoScroll();
});

console.log('Contact form script loaded successfully');
