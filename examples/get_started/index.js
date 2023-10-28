var canvas = document.getElementById("canvas");  // get canvas

let width = canvas.width;  // get canvas width
let height = canvas.height;  // get canvas height

let content = canvas.getContext('2d');  // get content of canvas

let particles = [];  // main array of particles
let springs = [];  // main array of springs
let joints = [];  // main array of rigid joints

// update function iterations
// more substeps => better accuracy
// more substeps => poor performance
let subSteps = 4; 

let G = 10;  // gravitational force

let secNow = 0;  // variable for storing frame start time
let secPrev = 0;  // variable for storing the end time of the previous frame
let secPassed = 0;  // time betweeen frames

// colors
let backgroundColor = "rgb(22, 22, 22)";
let particleColor = "rgb(200, 75, 49)";
let springColor = "rgb(45, 66, 99)";

// MAIN FUNCTION
function main() { 
    secNow = window.performance.now()  // get start time of this frame

    content.clearRect(0, 0, width, height);  // clear canvas

    content.fillStyle = backgroundColor;  // change color to background color
    content.fillRect(0, 0, width, height);  // draw background

    // substeps loop
    // you can perform several updates per frame for greater accuracy
    // in this case, the frame time is divided by the number of sub-steps
    for (let i = 0; i < subSteps; i++) {
        applyGravity(particles, G);
        update(particles, springs, joints, secPassed / subSteps);
    }

    drawEntities(content, particles, springs, joints); // draw particles, springs and joints on canvas
    
    secPassed = (secNow - secPrev) / 1000;  // get frame time and convers to seconds
    secPrev = secNow;  // get end time of this frame

    requestAnimationFrame(main);  // continue main loop
}


// a very basic example of adding a rectangle made of particles and springs
function addRect() {
    
    // add rectangle vertices
    // particle => x, y, radius(default=0), color(default=white), anchored(default=false)
    // add particle to particles list to update and draw
    particles.push(new Particle(500, 700, 15, particleColor));
    particles.push(new Particle(500, 500, 15, particleColor));
    particles.push(new Particle(700, 500, 15, particleColor));
    particles.push(new Particle(700, 700, 15, particleColor));

    // add rectangle edges
    // spring => particle1, particle2, strength, damping, width(default=0) color(default=white)
    // add spring to springs list to update and draw
    springs.push(new Spring(particles[0], particles[1], 0.8, 0.5, 5, springColor));
    springs.push(new Spring(particles[1], particles[2], 0.8, 0.5, 5, springColor));
    springs.push(new Spring(particles[2], particles[3], 0.8, 0.5, 5, springColor));
    springs.push(new Spring(particles[3], particles[0], 0.8, 0.5, 5, springColor));
    springs.push(new Spring(particles[0], particles[2], 0.8, 0.5, 5, springColor));
    springs.push(new Spring(particles[3], particles[1], 0.8, 0.5, 5, springColor));
}

// a very basic example of adding a rope made of particles and rigid connections with anchor
function addRope() {
    // add anchor
    // particle => x, y, radius(default=0), color(default=white), anchored(default=false)
    particles.push(new Particle(900, 500, 15, undefined, true))

    // add 15 rope particles
    // particle => x, y, radius(default=0), color(default=white), anchored(default=false)
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(935 + (35 + i) * i, 500, 15 + i, particleColor))
    }

    // add rigid joints between rope particles
    // joint => particle1, particle2, width(default=0) color(default=white)
    for (let i = 0; i < 15; i++) {
        joints.push(new Joint(particles[i+4], particles[i+5]))
    }
}

addRect();
addRope();
main();


