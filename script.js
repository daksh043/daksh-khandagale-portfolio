'use strict';

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

        // Securely open default mail client via encoded mailto
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        const mailtoUrl = `mailto:dakshkhandagale.ai@gmail.com?subject=${subject}&body=${body}`;

        showStatus('Thank you! Opening your email client to send the message...', 'success');

        setTimeout(() => {
            window.location.href = mailtoUrl;
            contactForm.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }, 800);
    });
});
