// start only when everything is loaded
window.onload = function() {
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
    let subSteps = 8; 

    let G = 10;  // gravitational force

    let secNow = 0;  // variable for storing frame start time
    let secPrev = 0;  // variable for storing the end time of the previous frame
    let secPassed = 0;  // time betweeen frames

    // colors
    let backgroundColor = "rgb(56, 58, 86)";
    let springColor = "rgb(237, 230, 138)";

    // !====================!
    //      MOUSE PART
    // create mouse object
    // mouse position will be automaticly updated and stored in mouse.x and mouse.y
    // mouse => canvas object, spawn position x, spawn position y, pick up radius
    let mouse = new Mouse(canvas, 0, 0, 50);


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

            // this function prevents particles from falling off the screen
            applyConstraint(particles, width, height)

            // enable the ability to pick up particles with the mouse
            // you need to pass a list of particles
            mouse.applyPickUp(particles);
        }

        drawEntities(content, particles, springs, joints); // draw particles, springs and joints on canvas
        
        secPassed = (secNow - secPrev) / 1000;  // get frame time and convers to seconds
        secPrev = secNow;  // get end time of this frame

        requestAnimationFrame(main);  // continue main loop
    }

    // a very primitive example of a function for adding a fabric-like structure
    function spawnCloth() {
        let clothSize = 20

        // add cloth particles
        // particle => x, y, radius(default=0), color(default=white), anchored(default=false)
        // add particle to particles list to update and draw
        for (let i = 0; i < clothSize; i++) {
            for (let j = 0; j < clothSize; j++) {
                particles.push(new Particle(550 + i*40, 200 + j*40))
            }
        }

        // add vetical springs
        // spring => particle1, particle2, strength, damping, width(default=0) color(default=white)
        // add spring to springs list to update and draw
        for (let i = 0; i < clothSize**2; i++) {
            if ((i+1) % clothSize != 0) {
                springs.push(new Spring(particles[i], particles[i+1], 5, 10, 3, springColor))
            }
        }

        // add horizontal springs
        // spring => particle1, particle2, strength, damping, width(default=0) color(default=white)
        // add spring to springs list to update and draw
        for (let i = 0; i < clothSize**2 - clothSize; i++) {
            springs.push(new Spring(particles[i], particles[i+clothSize], 5, 10, 3, springColor))
        }
        
        // make top part anchored
        for (let i = 0; i < clothSize; i++) {
            particles[i*clothSize].anchored = true
        }
    }

    spawnCloth();
    main();
}