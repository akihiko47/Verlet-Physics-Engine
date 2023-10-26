var canvas = document.getElementById("canvas");

let width = canvas.width;
let height = canvas.height;

let content = canvas.getContext('2d'); 

let G = 900;

let particles = [];
let springs = [];
let joints = [];

let msTotal = 0;
let msPrev = window.performance.now();
let msPassed = 16 / 1000;

let maxParticles = 1500; 
let nowParticles = 0;


let subSteps = 4;

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

let borderSize = 30;

let grd = content.createLinearGradient(0, 0, 0, height);
grd.addColorStop(1, "#221f23");
grd.addColorStop(0, "#11151d");

// colors
let wallsColor = "#282a36"


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

    for (let i = 0; i < subSteps; i++) {
        apply_gravity(particles, G);
        apply_constraint(content, particles);
        update_positions(particles, msPassed / subSteps);
        handle_between_collision(particles);
        apply_springs(springs);
        apply_joints(joints);

        if (mouseDown) {
            particles[1].x_now = mouseX;
            particles[1].y_now = mouseY;
        }
    }

    draw_springs(content, springs);
    draw_particles(content, particles);

    msPassed = (msNow - msPrev) / 1000;
    msPrev = msNow;
    msTotal += msPassed;

    requestAnimationFrame(main); 
}


particles.push(new Particle(500, 700, 0, 0, 15, false));
particles.push(new Particle(500, 500, 0, 0, 15, false));
particles.push(new Particle(700, 500, 0, 0, 15, false));
particles.push(new Particle(700, 700, 0, 0, 15, false));

springs.push(new Spring(particles[0], particles[1], 0.8, 0.2));
springs.push(new Spring(particles[1], particles[2], 0.8, 0.2));
springs.push(new Spring(particles[2], particles[3], 0.8, 0.2));
springs.push(new Spring(particles[3], particles[0], 0.8, 0.2));
springs.push(new Spring(particles[0], particles[2], 0.8, 0.2));
springs.push(new Spring(particles[3], particles[1], 0.8, 0.2));

for (let i = 0; i < 40; i++) {
    particles.push(new Particle(715 + 30 * i , 715, 0, 0, 15, false));
}

for (let i = 0; i < 40; i++) {
    joints.push(new Joint(particles[i+3], particles[i+4]));
}

particles.push(new Particle(1000, 500, 0, 0, 30, false));
particles.push(new Particle(1300, 500, 0, 0, 30, false));
particles.push(new Particle(1300, 800, 0, 0, 30, false));
particles.push(new Particle(1000, 800, 0, 0, 30, false));

springs.push(new Spring(particles[44], particles[45], 0.8, 0.2));
springs.push(new Spring(particles[45], particles[46], 0.8, 0.2));
springs.push(new Spring(particles[46], particles[47], 0.8, 0.2));
springs.push(new Spring(particles[47], particles[44], 0.8, 0.2));
springs.push(new Spring(particles[44], particles[46], 0.8, 0.2));
springs.push(new Spring(particles[45], particles[47], 0.8, 0.2));


main();