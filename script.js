const html = document.documentElement;
const canvas = document.getElementById("scroll-animation");
const context = canvas.getContext("2d");

const frameCount = 240;
const images = [];
let imagesLoaded = 0;

const currentFrame = index => (
    `frames/frame_${index.toString().padStart(5, '0')}.jpg`
);

// Preload all images and store in array
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
    img.onload = () => {
        imagesLoaded++;
        if (i === 0) { // When first image loads, draw it
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
    const scrollFraction = scrollTop / maxScrollTop;
    
    // Calculate the frame index based on the scroll position
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    // Request animation frame for smooth rendering if frame changed and is loaded
    if (frameIndex !== lastFrameIndex && images[frameIndex].complete) {
        requestAnimationFrame(() => {
            context.drawImage(images[frameIndex], 0, 0);
        });
        lastFrameIndex = frameIndex;
    }
});
