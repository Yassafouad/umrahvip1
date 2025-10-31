// Language Management
let currentLang = 'ar'; // Default language is Arabic

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
    initSmoothScroll();
    initLazyLoading();
    initIntersectionObserver();
    initMobileMenu();
    initDataLayerTracking();
    loadLanguage(currentLang);
});

// Language Toggle Functionality
function initLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    const html = document.documentElement;
    
    // Update HTML direction and lang attribute
    if (lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
    }
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update all text elements with data attributes
    updateTextContent();
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

function loadLanguage(lang) {
    // Check if there's a saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        lang = savedLang;
        currentLang = savedLang;
    }
    
    switchLanguage(lang);
}

function updateTextContent() {
    // Update all elements with data-ar and data-en attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'IMG') {
                element.alt = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

// Smooth Scroll Functionality
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src || img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Intersection Observer for Fade-in Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Data Layer Tracking for Analytics
function initDataLayerTracking() {
    // Initialize dataLayer if it doesn't exist
    if (typeof window.dataLayer === 'undefined') {
        window.dataLayer = [];
    }
    
    // Track CTA button clicks
    document.querySelectorAll('[data-event]').forEach(element => {
        element.addEventListener('click', function() {
            const eventData = {
                event: this.getAttribute('data-event'),
                action: this.getAttribute('data-action'),
                label: this.getAttribute('data-label')
            };
            
            // Push to dataLayer for Google Analytics
            if (window.dataLayer) {
                window.dataLayer.push(eventData);
            }
            
            // Log for debugging (remove in production)
            console.log('Event tracked:', eventData);
        });
    });
}

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 50) {
            header.classList.add('scrolled');
            if (navbar) {
                navbar.style.padding = '0.8rem 0';
            }
        } else {
            header.classList.remove('scrolled');
            if (navbar) {
                navbar.style.padding = '1.2rem 0';
            }
        }
    }
    
    lastScroll = currentScroll;
});

// Video Lazy Loading (if video exists)
function initVideoLazyLoading() {
    const videos = document.querySelectorAll('video[data-src]');
    
    if (videos.length > 0) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    video.load();
                    observer.unobserve(video);
                }
            });
        }, {
            threshold: 0.25
        });
        
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }
}

// Initialize video lazy loading
document.addEventListener('DOMContentLoaded', initVideoLazyLoading);

// Handle image errors gracefully
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Set a placeholder image if the image fails to load
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
        this.alt = 'Image placeholder';
    });
});

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll events
const optimizedScroll = debounce(() => {
    // Add any scroll-based functionality here
}, 100);

window.addEventListener('scroll', optimizedScroll);

