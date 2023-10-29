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
    let subSteps = 4; 

    let G = 10;  // gravitational force

    let secNow = 0;  // variable for storing frame start time
    let secPrev = 0;  // variable for storing the end time of the previous frame
    let secPassed = 0;  // time betweeen frames

    // colors
    let backgroundColor = "rgb(34, 40, 49)";
    let particleColor = "rgb(240, 84, 84)";
    let springColor = "rgb(48, 71, 94)";

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

    // spawn 50 particles in random locations
    function spawnParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(Math.random()*width, Math.random()*height, 20 + Math.random()*20, particleColor));
        }
    }

    spawnParticles();
    main();
}