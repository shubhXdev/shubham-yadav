// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

let mouse = {
    x: undefined,
    y: undefined
}

document.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    cursor.style.left = e.x + 'px';
    cursor.style.top = e.y + 'px';
    cursorBlur.style.left = e.x + 'px';
    cursorBlur.style.top = e.y + 'px';
});

document.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Canvas Motion Graphics
const canvas = document.getElementById('motion-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 120; // Increased count

class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * canvas.width; // Random start pos
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5; // Faster movement
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1.5; // Slightly larger

        // Much lighter colors for visibility
        // Green: Lighter Army Green, Red: Brighter Red, White: Tech accent
        const rand = Math.random();
        if (rand > 0.9) {
            this.color = 'rgba(255, 50, 50, 0.9)'; // Bright Red
        } else if (rand > 0.7) {
            this.color = 'rgba(200, 200, 200, 0.8)'; // White/Grey
        } else {
            this.color = 'rgba(100, 150, 50, 0.8)'; // Lighter Green
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges instead of reset for continuous feel
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != undefined && mouse.y != undefined) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                // Gentle attraction
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (200 - distance) / 200;
                const directionMultiplier = 0.05; // Strength of attraction

                this.vx += forceDirectionX * force * directionMultiplier;
                this.vy += forceDirectionY * force * directionMultiplier;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect to other particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                // Lighter connection lines
                ctx.strokeStyle = `rgba(150, 200, 100, ${0.3 - distance / 400})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != undefined && mouse.y != undefined) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                ctx.beginPath();
                // Interactive connection line (Red/White mix)
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - distance / 400})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Form Handling
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = 'SENDING...';
    btn.style.borderColor = 'var(--text-main)';

    setTimeout(() => {
        btn.innerText = 'TRANSMISSION COMPLETE';
        btn.style.color = '#fff';
        btn.style.background = 'var(--accent-green)';

        setTimeout(() => {
            e.target.reset();
            btn.innerText = originalText;
            btn.style.background = 'transparent';
            btn.style.color = 'var(--accent-green)';
        }, 3000);
    }, 1500);
});
