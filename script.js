// Elite Portfolio V2 - Interactions

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initTypewriter();
    initScrollReveal();
    initNavbar();
    initCustomCursor();
    initSkillsTabs();
    initProjectFilters();
    initModals();
    initMobileMenu();
    initTiltEffect();
});

// --- Loader ---
function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 2000);
}

// --- Particles.js ---
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#3b82f6" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" }
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } }
                }
            },
            "retina_detect": true
        });
    }
}

// --- Typewriter ---
function initTypewriter() {
    const el = document.getElementById('typewriter');
    const phrases = ['Software Engineer.', 'Problem Solver.', 'Creative Developer.'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

// --- Scroll Reveal ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Animate numbers if it's the stats section
                if (entry.target.querySelector('.stat-num')) {
                    animateNumbers(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function animateNumbers(container) {
    const nums = container.querySelectorAll('.stat-num');
    nums.forEach(num => {
        const target = +num.getAttribute('data-target');
        const updateCount = () => {
            const count = +num.innerText;
            const inc = target / 100;

            if (count < target) {
                num.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                num.innerText = target;
            }
        };
        updateCount();
    });
}

// --- Navbar ---
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// --- Custom Cursor ---
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Add some lag to the outline
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects
    document.querySelectorAll('a, button, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            outline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(1)';
            outline.style.backgroundColor = 'transparent';
        });
    });
}

// --- Skills Tabs ---
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.skill-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// --- Project Filters ---
function initProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                    setTimeout(() => project.style.opacity = '1', 10);
                } else {
                    project.style.opacity = '0';
                    setTimeout(() => project.style.display = 'none', 300);
                }
            });
        });
    });
}

// --- Modals ---
function initModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalBody = document.getElementById('modal-body');

    // Project Data
    const projectData = {
        'p1': {
            title: 'Maze Runner Game',
            desc: 'Interactive maze game with multiple difficulty levels (Easy, Medium, Hard) and collision detection. Features random maze generation, lives system, and smooth canvas-based gameplay.',
            tech: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
            img: 'maze_runner_game.png',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: 'projects/maze/index.html'
        },
        'p2': {
            title: 'Project Two',
            desc: 'Interactive web application featuring dynamic content updates and API integration.',
            tech: ['JavaScript', 'API'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/8b5cf6?text=Project+2',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        },
        'p3': {
            title: 'Project Three',
            desc: 'High-performance system utility built with C++ focusing on algorithmic efficiency.',
            tech: ['C++', 'Algorithms'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/10b981?text=Project+3',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        },
        'p4': {
            title: 'Project Four',
            desc: 'Low-level system programming project demonstrating memory management and pointers.',
            tech: ['C Language', 'Systems'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/f59e0b?text=Project+4',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        },
        'p5': {
            title: 'Project Five',
            desc: 'Responsive website design with modern aesthetics and cross-browser compatibility.',
            tech: ['HTML/CSS', 'Design'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/ec4899?text=Project+5',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        },
        'p6': {
            title: 'Project Six',
            desc: 'Interactive frontend application using advanced DOM manipulation techniques.',
            tech: ['JavaScript', 'DOM'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/6366f1?text=Project+6',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        },
        'p7': {
            title: 'Project Seven',
            desc: 'Object-Oriented Programming demonstration using C++ classes and inheritance.',
            tech: ['C++', 'OOP'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/14b8a6?text=Project+7',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        },
        'p8': {
            title: 'Project Eight',
            desc: 'Comprehensive web solution integrating multiple technologies for a seamless user experience.',
            tech: ['Full Stack', 'Web'],
            img: 'https://via.placeholder.com/600x300/1a1a1a/8b5cf6?text=Project+8',
            github: 'https://github.com/Syed-Usman-Ali-Shah',
            demo: '#'
        }
    };

    window.openModal = (id) => {
        const data = projectData[id];
        if (!data) return;

        modalBody.innerHTML = `
            <img src="${data.img}" alt="${data.title}" style="width:100%; border-radius:8px; margin-bottom:1rem;">
            <h2 style="margin-bottom:0.5rem; color:white;">${data.title}</h2>
            <p style="color:#a3a3a3; margin-bottom:1rem;">${data.desc}</p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
                ${data.tech.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div style="display:flex; gap:1rem;">
                <a href="${data.demo}" target="_blank" class="btn btn-primary" ${data.demo === '#' ? 'style="opacity:0.5; pointer-events:none;"' : ''}>Live Demo</a>
                <a href="${data.github}" target="_blank" class="btn btn-secondary">Source Code</a>
            </div>
        `;

        modal.style.display = 'flex';
    };

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// --- Mobile Menu ---
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#0a0a0a';
            navLinks.style.padding = '2rem';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        }
    });
}

// --- Tilt Effect ---
function initTiltEffect() {
    const card = document.querySelector('.image-wrapper');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}
