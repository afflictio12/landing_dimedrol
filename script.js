// FAQ Toggle
function toggleFAQ(button) {
    const question = button;
    const answer = button.nextElementSibling;

    question.classList.toggle('active');
    answer.classList.toggle('show');

    // Close other FAQs
    document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== question) {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('show');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Don't prevent default for data-placeholder links
        if (!this.hasAttribute('data-placeholder')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 20, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 20, 0.95)';
    }
});

// Hero parallax
const hero = document.querySelector('.hero');
const heroBackground = document.querySelector('.hero-background');
const heroOrbs = document.querySelector('.hero-orbs');
if (hero && heroBackground && heroOrbs && finePointer && !prefersReducedMotion) {
    hero.addEventListener('mousemove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroBackground.style.transform = `translate3d(${x * 20}px, ${y * 20}px, 0)`;
        heroOrbs.style.transform = `translate3d(${x * -30}px, ${y * -30}px, 0)`;
    });

    hero.addEventListener('mouseleave', () => {
        heroBackground.style.transform = '';
        heroOrbs.style.transform = '';
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe game cards, feature items, promo cards, the game highlight, and socials
document.querySelectorAll('[data-reveal], .game-card, .feature-item, .promo-card, .game-frame, .social-btn').forEach(el => {
    if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
    }
    observer.observe(el);
});

document.querySelectorAll('.tilt-single').forEach(el => {
    if (!el.classList.contains('tilt-card')) {
        el.classList.add('tilt-card');
    }
    if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        observer.observe(el);
    }
});

function attachTilt(element) {
    let rect = null;
    let ticking = false; // Tracks if a frame is already waiting to be drawn

    const updateTilt = (x, y) => {
        rect = rect || element.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        // Reduced the multiplier from 12 to 8 for a slightly subtler, smoother tilt
        const rotateY = ((relativeX / rect.width) - 0.5) * 8; 
        const rotateX = ((relativeY / rect.height) - 0.5) * -8;
        
        element.style.setProperty('--tilt-x', `${rotateX}deg`);
        element.style.setProperty('--tilt-y', `${rotateY}deg`);
        
        ticking = false; // Reset the lock once the frame is drawn
    };

    element.addEventListener('mouseenter', () => {
        rect = element.getBoundingClientRect();
        element.classList.add('is-tilting');
    });

    element.addEventListener('mousemove', (event) => {
        // Only request a new frame if we aren't already waiting for one
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTilt(event.clientX, event.clientY);
            });
            ticking = true;
        }
    });

    element.addEventListener('mouseleave', () => {
        element.classList.remove('is-tilting');
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
        rect = null;
    });
}

if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll('.tilt-single').forEach(el => attachTilt(el));
}

// Button glow effect on hover
document.querySelectorAll('.cta-btn, .btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        if (cursorGlow && finePointer) {
            cursorGlow.style.filter = 'blur(8px)';
        }
    });
    btn.addEventListener('mouseleave', function() {
        if (cursorGlow && finePointer) {
            cursorGlow.style.filter = 'blur(4px)';
        }
    });
});

console.log('LuxBet x Brice landing page loaded successfully!');
