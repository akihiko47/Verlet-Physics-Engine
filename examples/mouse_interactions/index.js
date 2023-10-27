var canvas = document.getElementById("canvas");

let width = canvas.width;
let height = canvas.height;

let content = canvas.getContext('2d'); 

let particles = [];
let springs = [];
let joints = [];

let subSteps = 4;

let G = 10;

let msNow = 0;
let msPrev = 0;
let msPassed = 0;

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;


// colors
let wallsColor = "#282a36";
let backgroundColor = "rgb(0, 0, 0)";
let particleColor = "rgb(200, 0, 200)";
let springColor = "rgb(200, 0, 200)";


function getMousePosition(canvas, event) { 
    let rect = canvas.getBoundingClientRect(); 
    mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
} 

canvas.addEventListener("mousemove", function(e) {getMousePosition(canvas, e)}); 

canvas.addEventListener('mousedown', function() {
    mouseDown = true;
});

canvas.addEventListener('mouseup', function() {
    mouseDown = false;
});

function main() { 
    let msNow = window.performance.now()

    content.clearRect(0, 0, width, height);

    content.fillStyle = backgroundColor;
    content.fillRect(0, 0, width, height);

    for (let i = 0; i < subSteps; i++) {
        applyGravity(particles, G);
        update(particles, springs, joints, msPassed / subSteps);

        if (mouseDown) {
            particles[1].x_now = mouseX;
            particles[1].y_now = mouseY;
        }
    }

    drawEntities(content, particles, springs, joints);

    msPassed = (msNow - msPrev) / 1000;
    msPrev = msNow;

    requestAnimationFrame(main); 
}


particles.push(new Particle(500, 700, 15, particleColor));
particles.push(new Particle(500, 500, 15, particleColor));
particles.push(new Particle(700, 500, 15, particleColor));
particles.push(new Particle(700, 700, 15, particleColor));

springs.push(new Spring(particles[0], particles[1], 0.8, 0.2, springColor));
springs.push(new Spring(particles[1], particles[2], 0.8, 0.2, springColor));
springs.push(new Spring(particles[2], particles[3], 0.8, 0.2, springColor));
springs.push(new Spring(particles[3], particles[0], 0.8, 0.2, springColor));
springs.push(new Spring(particles[0], particles[2], 0.8, 0.2, springColor));
springs.push(new Spring(particles[3], particles[1], 0.8, 0.2, springColor));

for (let i = 0; i < 40; i++) {
    particles.push(new Particle(715 + 30 * i , 715, 15, false));
}

for (let i = 0; i < 40; i++) {
    joints.push(new Joint(particles[i+3], particles[i+4]));
}

particles.push(new Particle(1000, 500, 30, particleColor));
particles.push(new Particle(1300, 500, 30, particleColor));
particles.push(new Particle(1300, 800, 30, particleColor));
particles.push(new Particle(1000, 800, 30, particleColor));

springs.push(new Spring(particles[44], particles[45], 0.8, 0.2, springColor));
springs.push(new Spring(particles[45], particles[46], 0.8, 0.2, springColor));
springs.push(new Spring(particles[46], particles[47], 0.8, 0.2, springColor));
springs.push(new Spring(particles[47], particles[44], 0.8, 0.2, springColor));
springs.push(new Spring(particles[44], particles[46], 0.8, 0.2, springColor));
springs.push(new Spring(particles[45], particles[47], 0.8, 0.2, springColor));


main();