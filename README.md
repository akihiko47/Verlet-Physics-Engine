# ⚛️ JS physics engine ⚛️

![logo](https://github.com/akihiko47/Verlet-Physics-Engine/blob/main/logo.jpg?raw=true)

A simple physics engine based on verlet integration. Realization of particles, collisions between particles, springs, solid joints and anchors. It is possible to implement: soft bodies, rigid bodies, ropes, etc. You can see examples [here.](https://akihiko47.github.io/Verlet-Physics-Engine/)

## Files 
There are two files:
1. `classes.js` This file implements the particle, spring, solid joints, and mouse classes.
2. `utils.js` This file contains help functions such as: particle rendering, position updates, spring state updates, mouse position updates.

You need to add these 2 files to your project and you will be able to use all the functionality you need. An example of adding can be seen in the first example.

## Classes
1. `Particle(x, y, radius=0, color="#ffffff", anchored=false)`
2. `Spring(particle1, particle2, strength, damping, width=0, color="#ffffff")`
3. `Joint(particle1, particle2, width=0, color="#ffffff")`
4. `Mouse(canvas, x=0, y=0, pickRadius=50)`

With these classes it is possible to implement most of the necessary things such as: soft bodies, rigid bodies, ropes, etc.
An important concept is that instances of these classes of your program should be added to the following lists:

    let particles = [];  // main array of particles
    let springs = [];  // main array of springs
    let joints = [];  // main array of rigid joints

After that, they can then be updated with the function `update(particles, springs, joints, dt);` Please check out the examples for more information.

## Mouse class
You can create an instance of the mouse class using this line `let mouse = new Mouse(canvas, 0, 0);`
After that, the mouse position on the canvas will be automatically updated, get it using these lines:

    let m_x = mouse.x;
    let m_y = mouse.y;
    let m_down = mouse.down;

## Main loop
[Watch a simple example of the program and main loop in the first example.](https://github.com/akihiko47/Verlet-Physics-Engine/blob/main/examples/get_started/index.js)
This implementation is not mandatory. Feel free to add your own implementation variants.

## Usage
Just copy the example you need and add the necessary functions to add the bodies you want. Feel free to change the code of classes and functions for the task you need. [These examples should serve as the main learning ground.](https://github.com/akihiko47/Verlet-Physics-Engine/blob/main/examples)

## Contributions
Contributions are welcomed! 👋