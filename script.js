function toggleFAQ(button) {
    const question = button;
    const answer = button.nextElementSibling;

    question.classList.toggle('active');
    answer.classList.toggle('show');

    document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== question) {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('show');
        }
    });
}

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

const hero = document.querySelector('.hero');
const heroBackground = document.querySelector('.hero-background');
const heroOrbs = document.querySelector('.hero-orbs');
if (hero && heroBackground && heroOrbs && finePointer && !prefersReducedMotion) {
    hero.addEventListener('mousemove', (event) => {
        // Оптимізовано за допомогою requestAnimationFrame для уникнення лагів
        window.requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            heroBackground.style.transform = `translate3d(${x * 20}px, ${y * 20}px, 0)`;
            heroOrbs.style.transform = `translate3d(${x * -30}px, ${y * -30}px, 0)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        heroBackground.style.transform = '';
        heroOrbs.style.transform = '';
    });
}

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
        const rotateY = ((relativeX / rect.width) - 0.5) * 8; 
        const rotateX = ((relativeY / rect.height) - 0.5) * -8;
        
        element.style.setProperty('--tilt-x', `${rotateX}deg`);
        element.style.setProperty('--tilt-y', `${rotateY}deg`);
        
        ticking = false; 
    };

    element.addEventListener('mouseenter', () => {
        rect = element.getBoundingClientRect();
        element.classList.add('is-tilting');
    });

    element.addEventListener('mousemove', (event) => {
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

