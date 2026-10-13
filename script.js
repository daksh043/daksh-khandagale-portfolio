'use strict';

// ----------------------------------------------------
// 0. Cinematic High-Tech Intro Animation Controller
// ----------------------------------------------------
(function initCinematicIntro() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    // Respect user's motion preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.remove('intro-active');
        overlay.remove();
        return;
    }

    const barFill = document.getElementById('intro-bar-fill');
    const progressNum = document.getElementById('intro-progress-number');
    const statusMsg = document.getElementById('intro-status-msg');
    const shockwave = document.getElementById('intro-shockwave');
    const skipBtn = document.getElementById('intro-skip-btn');
    const canvas = document.getElementById('intro-canvas');

    let isFinished = false;
    let animFrameId = null;

    // Scroll prevention during intro without modifying body height/overflow
    const preventScroll = (e) => {
        if (!isFinished) {
            e.preventDefault();
        }
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    const preventKeys = (e) => {
        if (!isFinished && ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
            e.preventDefault();
        }
    };
    window.addEventListener('keydown', preventKeys, { passive: false });

    // Trigger complete dissolve transition
    const triggerComplete = () => {
        if (isFinished) return;
        isFinished = true;
        if (animFrameId) cancelAnimationFrame(animFrameId);

        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventKeys);

        // Climax shockwave pulse
        if (shockwave) shockwave.classList.add('flash');

        // Smoothly fade out overlay
        overlay.classList.add('intro-revealing');

        // Fade in main website content
        setTimeout(() => {
            document.body.classList.remove('intro-active');
        }, 350);

        // Final DOM cleanup
        setTimeout(() => {
            overlay.classList.add('intro-complete');
            overlay.remove();
        }, 700);
    };

    // Skip controls
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerComplete();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            triggerComplete();
        }
    });

    overlay.addEventListener('dblclick', () => {
        triggerComplete();
    });

    // Ambient Micro-Particle Constellation Canvas
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const onResize = () => {
            if (isFinished) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        const PARTICLE_COUNT = Math.min(45, Math.floor((width * height) / 25000));
        const particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 1.8 + 0.8,
                alpha: Math.random() * 0.6 + 0.2
            });
        }

        const renderCanvas = () => {
            if (isFinished) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.x += p1.vx;
                p1.y += p1.vy;
                if (p1.x < 0 || p1.x > width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > height) p1.vy *= -1;

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(224, 74, 74, ${p1.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(224, 74, 74, ${(1 - dist / 100) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderCanvas);
        };
        renderCanvas();
    }

    // Dynamic Telemetry Status Messages
    const stages = [
        { pct: 0, text: 'INITIALIZING NEURAL CORE...' },
        { pct: 28, text: 'CALIBRATING ML ARCHITECTURES...' },
        { pct: 64, text: 'SYNCHRONIZING REPOSITORIES...' },
        { pct: 90, text: 'SYSTEM READY // ACCESS GRANTED' }
    ];

    // Progress Counter Engine (0% -> 100% over ~1800ms)
    const startTime = performance.now();
    const DURATION = 1800; // ms

    const updateTelemetry = (now) => {
        if (isFinished) return;

        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / DURATION);
        // Eased cubic progression
        const eased = 1 - Math.pow(1 - rawProgress, 3);
        const currentPercent = Math.min(100, Math.floor(eased * 100));

        if (barFill) barFill.style.width = currentPercent + '%';
        if (progressNum) progressNum.textContent = currentPercent + '%';

        for (let i = stages.length - 1; i >= 0; i--) {
            if (currentPercent >= stages[i].pct) {
                if (statusMsg && statusMsg.textContent !== stages[i].text) {
                    statusMsg.textContent = stages[i].text;
                }
                break;
            }
        }

        if (rawProgress < 1) {
            animFrameId = requestAnimationFrame(updateTelemetry);
        } else {
            // Reached 100% -> Trigger Shutter Split
            setTimeout(() => {
                triggerComplete();
            }, 140);
        }
    };

    animFrameId = requestAnimationFrame(updateTelemetry);
})();

// ----------------------------------------------------
// 1. Scroll-Driven Canvas Animation
// ----------------------------------------------------
const html = document.documentElement;
const canvas = document.getElementById("scroll-animation");
const context = canvas ? canvas.getContext("2d") : null;

const frameCount = 240;
const images = [];
let imagesLoaded = 0;

const currentFrame = index => (
    `frames/frame_${index.toString().padStart(5, '0')}.jpg`
);

if (canvas && context) {
    // Preload all images and store in array
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
        img.onload = () => {
            imagesLoaded++;
            if (i === 0) {
                // When first image loads, draw it
                canvas.width = images[0].width;
                canvas.height = images[0].height;
                context.drawImage(images[0], 0, 0);
            }
        };
    }

    let lastFrameIndex = 0;

    window.addEventListener('scroll', () => {
        // Prevent background image scrubbing while intro is active
        if (document.body.classList.contains('intro-active')) {
            window.scrollTo(0, 0);
            return;
        }

        const scrollTop = html.scrollTop;
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        if (maxScrollTop <= 0) return;
        const scrollFraction = scrollTop / maxScrollTop;

        // Calculate the frame index based on the scroll position
        const frameIndex = Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(scrollFraction * frameCount))
        );

        // Request animation frame for smooth rendering if frame changed and is loaded
        if (frameIndex !== lastFrameIndex && images[frameIndex] && images[frameIndex].complete) {
            requestAnimationFrame(() => {
                context.drawImage(images[frameIndex], 0, 0);
            });
            lastFrameIndex = frameIndex;
        }
    }, { passive: true });
}

// ----------------------------------------------------
// 2. Secure Contact Form Handling & Anti-Spam Protection
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Mobile Navigation Drawer Toggle
    // ----------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('nav-menu-open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close when clicking any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-menu-open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('nav-menu-open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('nav-menu-open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ----------------------------------------------------
    // Payment / Support Modal Controller
    // ----------------------------------------------------
    const paymentModal = document.getElementById('payment-modal');
    const openPaymentBtns = document.querySelectorAll('.open-payment-modal');
    const closePaymentBtn = document.getElementById('close-payment-modal');
    const copyUpiBtn = document.getElementById('copy-upi-btn');

    if (paymentModal) {
        openPaymentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                paymentModal.classList.add('modal-open');
                paymentModal.setAttribute('aria-hidden', 'false');
            });
        });

        if (closePaymentBtn) {
            closePaymentBtn.addEventListener('click', () => {
                paymentModal.classList.remove('modal-open');
                paymentModal.setAttribute('aria-hidden', 'true');
            });
        }

        paymentModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('payment-modal-backdrop')) {
                paymentModal.classList.remove('modal-open');
                paymentModal.setAttribute('aria-hidden', 'true');
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && paymentModal.classList.contains('modal-open')) {
                paymentModal.classList.remove('modal-open');
                paymentModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', () => {
            const upiId = 'dakshkhandagale@okhdfcbank';
            navigator.clipboard.writeText(upiId).then(() => {
                const originalText = copyUpiBtn.textContent;
                copyUpiBtn.textContent = 'Copied!';
                copyUpiBtn.style.borderColor = '#22c55e';
                copyUpiBtn.style.color = '#22c55e';
                setTimeout(() => {
                    copyUpiBtn.textContent = originalText;
                    copyUpiBtn.style.borderColor = '';
                    copyUpiBtn.style.color = '';
                }, 2000);
            }).catch(() => {
                copyUpiBtn.textContent = upiId;
            });
        });
    }
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (!contactForm) return;

    let lastSubmissionTime = 0;
    const SUBMIT_COOLDOWN_MS = 10000; // 10s anti-flood throttle

    const showStatus = (message, type) => {
        if (!formStatus) return;
        formStatus.textContent = message; // Safe textContent prevents XSS
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Anti-Bot Honeypot trap check
        const honeypot = document.getElementById('website_hp');
        if (honeypot && honeypot.value.trim() !== '') {
            // Silently drop bot submission
            contactForm.reset();
            return;
        }

        // Rate limiting / Flood prevention
        const now = Date.now();
        if (now - lastSubmissionTime < SUBMIT_COOLDOWN_MS) {
            const secondsLeft = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
            showStatus(`Please wait ${secondsLeft} second(s) before sending another message.`, 'error');
            return;
        }

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = (nameInput ? nameInput.value : '').trim();
        const email = (emailInput ? emailInput.value : '').trim();
        const message = (messageInput ? messageInput.value : '').trim();

        // Input Validation & Length Bounds
        if (!name || name.length > 80) {
            showStatus('Please enter a valid name (maximum 80 characters).', 'error');
            if (nameInput) nameInput.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email || !emailRegex.test(email) || email.length > 100) {
            showStatus('Please enter a valid email address.', 'error');
            if (emailInput) emailInput.focus();
            return;
        }

        if (!message || message.length < 5 || message.length > 2000) {
            showStatus('Please enter a message between 5 and 2000 characters.', 'error');
            if (messageInput) messageInput.focus();
            return;
        }

        // Update submission timestamp
        lastSubmissionTime = now;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Preparing email...';
        }

        // Attempt direct async dispatch to FormSubmit API with mailto fallback
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        const mailtoUrl = `mailto:dakshkhandagale.ai@gmail.com?subject=${subject}&body=${body}`;

        showStatus('Sending message...', 'info');

        fetch('https://formsubmit.co/ajax/dakshkhandagale.ai@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: `Portfolio Inquiry from ${name}`
            })
        })
        .then(response => {
            if (response.ok) {
                showStatus('Thank you! Your message was sent directly to Daksh.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Server returned non-200');
            }
        })
        .catch(() => {
            // Graceful fallback to mail client
            showStatus('Opening your email client to send the message...', 'success');
            setTimeout(() => {
                window.location.href = mailtoUrl;
                contactForm.reset();
            }, 600);
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    });
});

// ----------------------------------------------------
// 3. Cyber Reticle Cursor & Interactive Click Sparks System
// ----------------------------------------------------
(function initCyberCursorAndSparks() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const sparkCanvas = document.getElementById('spark-canvas');

    if (!sparkCanvas) return;
    const ctx = sparkCanvas.getContext('2d');
    if (!ctx) return;

    let width = (sparkCanvas.width = window.innerWidth);
    let height = (sparkCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = sparkCanvas.width = window.innerWidth;
        height = sparkCanvas.height = window.innerHeight;
    }, { passive: true });

    // Cursor position tracking
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer && cursorDot && cursorRing) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
                ringX = mouseX;
                ringY = mouseY;
            }

            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            isVisible = false;
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            isVisible = true;
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });

        // Click recoil feedback
        window.addEventListener('mousedown', () => {
            cursorRing.classList.add('cursor-active');
            cursorDot.classList.add('cursor-active');
        });

        window.addEventListener('mouseup', () => {
            cursorRing.classList.remove('cursor-active');
            cursorDot.classList.remove('cursor-active');
        });

        // Hover effects on interactive elements
        const interactiveSelector = 'a, button, input, textarea, .btn, .card, .skill-badge, [role="button"], label';
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    cursorRing.classList.add('cursor-text');
                    cursorDot.classList.add('cursor-text');
                } else {
                    cursorRing.classList.add('cursor-hover');
                    cursorDot.classList.add('cursor-hover');
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                cursorRing.classList.remove('cursor-hover', 'cursor-text');
                cursorDot.classList.remove('cursor-hover', 'cursor-text');
            }
        });

        // Smooth Lerp loop for outer cursor ring
        const renderCursorRing = () => {
            if (isVisible) {
                ringX += (mouseX - ringX) * 0.22;
                ringY += (mouseY - ringY) * 0.22;
                cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            }
            requestAnimationFrame(renderCursorRing);
        };
        requestAnimationFrame(renderCursorRing);
    }

    // Sparks & Shockwaves Particle Physics
    const sparks = [];
    const shockwaves = [];
    let isSparksAnimating = false;

    const sparkColors = [
        '#ffffff',   // White-hot core
        '#ff3838',   // Bright neon red
        '#e04a4a',   // Crimson accent
        '#ff7373',   // Hot coral
        '#ffb3b3',   // Laser pink-white
        '#ff9933'    // Fiery amber
    ];

    // Create a spark burst explosion
    const createSparkBurst = (x, y) => {
        const count = Math.floor(Math.random() * 8) + 24; // 24 to 32 sparks

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 9 + 3; // 3 to 12 px/frame
            sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.8 + 1.6,
                color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
                life: 1.0,
                decay: Math.random() * 0.024 + 0.022,
                friction: 0.94,
                gravity: 0.16
            });
        }

        // Expanding shockwave ripple
        shockwaves.push({
            x: x,
            y: y,
            radius: 2,
            maxRadius: Math.random() * 15 + 40,
            life: 1.0,
            decay: 0.045
        });

        if (!isSparksAnimating) {
            isSparksAnimating = true;
            requestAnimationFrame(renderSparks);
        }
    };

    // Render loop for sparks
    const renderSparks = () => {
        ctx.clearRect(0, 0, width, height);

        // Render shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += (sw.maxRadius - sw.radius) * 0.18;
            sw.life -= sw.decay;

            if (sw.life <= 0) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(224, 74, 74, ${sw.life * 0.75})`;
            ctx.lineWidth = 1.5 * sw.life;
            ctx.shadowColor = '#e04a4a';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Render sparks with directional streaks
        for (let i = sparks.length - 1; i >= 0; i--) {
            const p = sparks[i];

            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                sparks.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.lineWidth = p.size * p.life;
            ctx.lineCap = 'round';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.stroke();

            // Incandescent bead
            ctx.beginPath();
            ctx.arc(p.x, p.y, (p.size * 0.5) * p.life, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.restore();
        }

        if (sparks.length > 0 || shockwaves.length > 0) {
            requestAnimationFrame(renderSparks);
        } else {
            isSparksAnimating = false;
            ctx.clearRect(0, 0, width, height);
        }
    };

    // Trigger sparks on any click or touch
    window.addEventListener('pointerdown', (e) => {
        createSparkBurst(e.clientX, e.clientY);
    }, { passive: true });
})();
