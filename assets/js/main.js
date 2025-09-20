// script.js

// Canvas particle network for hero section
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(10, 36, 99, 0.5)';
            this.ctx.fill();
        });
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(10, 36, 99, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
            
            // Mouse interaction
            const dx = this.particles[i].x - this.mouse.x;
            const dy = this.particles[i].y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `rgba(62, 146, 204, ${0.3 * (1 - distance / 150)})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
    }
}

// Initialize particle network
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
    new ParticleNetwork(heroCanvas);
}

// Research icon canvases
document.querySelectorAll('.icon-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const type = canvas.dataset.icon;
    canvas.width = 60;
    canvas.height = 60;
    
    // Draw different icons based on type
    ctx.strokeStyle = '#0a2463';
    ctx.lineWidth = 2;
    
    switch(type) {
        case 'network':
            // Draw network icon
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const x = 30 + Math.cos(angle) * 20;
                const y = 30 + Math.sin(angle) * 20;
                ctx.arc(x, y, 5, 0, Math.PI * 2);
            }
            ctx.stroke();
            break;
            
        case 'migration':
            // Draw migration arrow
            ctx.beginPath();
            ctx.moveTo(10, 30);
            ctx.lineTo(40, 30);
            ctx.lineTo(35, 25);
            ctx.moveTo(40, 30);
            ctx.lineTo(35, 35);
            ctx.moveTo(20, 20);
            ctx.lineTo(50, 20);
            ctx.lineTo(45, 15);
            ctx.moveTo(50, 20);
            ctx.lineTo(45, 25);
            ctx.stroke();
            break;
            
        case 'innovation':
            // Draw lightbulb
            ctx.beginPath();
            ctx.arc(30, 25, 12, 0, Math.PI * 2);
            ctx.moveTo(22, 35);
            ctx.lineTo(22, 40);
            ctx.lineTo(38, 40);
            ctx.lineTo(38, 35);
            ctx.stroke();
            break;
    }
});

// Timeline Canvas Animation
const timelineCanvas = document.getElementById('timeline-canvas');
if (timelineCanvas) {
    const ctx = timelineCanvas.getContext('2d');
    
    function drawTimeline() {
        const rect = timelineCanvas.getBoundingClientRect();
        timelineCanvas.width = rect.width;
        timelineCanvas.height = rect.height;
        
        ctx.strokeStyle = 'rgba(10, 36, 99, 0.1)';
        ctx.lineWidth = 2;
        
        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(50, timelineCanvas.height);
        ctx.stroke();
    }
    
    drawTimeline();
    window.addEventListener('resize', drawTimeline);
}

// Skills visualization canvas
const skillsCanvas = document.getElementById('skills-canvas');
if (skillsCanvas) {
    const ctx = skillsCanvas.getContext('2d');
    
    function drawSkillsVisualization() {
        const rect = skillsCanvas.getBoundingClientRect();
        skillsCanvas.width = rect.width;
        skillsCanvas.height = 400;
        
        // Create radar chart or network visualization
        const centerX = skillsCanvas.width / 2;
        const centerY = skillsCanvas.height / 2;
        const radius = 150;
        
        const skills = [
            { name: 'Research', value: 0.9 },
            { name: 'Technical', value: 0.88 },
            { name: 'Leadership', value: 0.92 },
            { name: 'Communication', value: 0.85 },
            { name: 'Innovation', value: 0.95 },
            { name: 'Strategy', value: 0.87 }
        ];
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            for (let j = 0; j < skills.length; j++) {
                const angle = (Math.PI * 2 / skills.length) * j - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius * i / 5);
                const y = centerY + Math.sin(angle) * (radius * i / 5);
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw skill polygon
        ctx.fillStyle = 'rgba(62, 146, 204, 0.2)';
        ctx.strokeStyle = '#3e92cc';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        skills.forEach((skill, i) => {
            const angle = (Math.PI * 2 / skills.length) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius * skill.value);
            const y = centerY + Math.sin(angle) * (radius * skill.value);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        
        skills.forEach((skill, i) => {
            const angle = (Math.PI * 2 / skills.length) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (radius + 30);
            const y = centerY + Math.sin(angle) * (radius + 30);
            
            ctx.fillText(skill.name, x, y);
        });
    }
    
    drawSkillsVisualization();
    window.addEventListener('resize', drawSkillsVisualization);
}

// Contact canvas background
const contactCanvas = document.getElementById('contact-canvas');
if (contactCanvas) {
    const ctx = contactCanvas.getContext('2d');
    
    function drawContactBackground() {
        const rect = contactCanvas.getBoundingClientRect();
        contactCanvas.width = rect.width;
        contactCanvas.height = rect.height;
        
        // Draw animated grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        for (let x = 0; x < contactCanvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, contactCanvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < contactCanvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(contactCanvas.width, y);
            ctx.stroke();
        }
    }
    
    drawContactBackground();
    window.addEventListener('resize', drawContactBackground);
}

// Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hide');
    }, 1000);
});

// Navigation scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Counter animation
const counters = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target + '+';
                }
            };
            
            updateCounter();
            entry.target.classList.add('counted');
        }
    });
}, observerOptions);

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percent = entry.target.dataset.percent;
            entry.target.style.width = percent + '%';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Testimonials slider
const testimonials = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    testimonials[index].classList.add('active');
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    navMenu.style.position = 'absolute';
    navMenu.style.top = '100%';
    navMenu.style.left = '0';
    navMenu.style.right = '0';
    navMenu.style.flexDirection = 'column';
    navMenu.style.background = 'white';
    navMenu.style.padding = '2rem';
    navMenu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
});

// Calendar integration
const scheduleBtn = document.getElementById('scheduleBtn');
const calendarWidget = document.getElementById('calendarWidget');

scheduleBtn?.addEventListener('click', () => {
    calendarWidget.classList.toggle('active');
    
    // Here you would integrate with Calendly or similar service
    if (!calendarWidget.innerHTML.trim()) {
        calendarWidget.innerHTML = `
            <p style="text-align: center; color: rgba(255,255,255,0.8);">
                Calendar integration will be configured here.<br>
                For now, please email me at maliyu@andrew.cmu.edu
            </p>
        `;
    }
});

// Portfolio filter (optional)
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});