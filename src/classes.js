class Particle {
    constructor(x, y, radius=0, color="#ffffff", anchored=false) {
        this.x = x;
        this.y = y;
        this.x_now = x;
        this.y_now = y;
        this.x_old = x;
        this.y_old = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.radius = radius;
        this.color = color;
        this.anchored = anchored;
    }
    
    update(dt) {
        this.vx = this.x_now - this.x_old;
        this.vy = this.y_now - this.y_old;

        this.x_old = this.x_now;
        this.y_old = this.y_now;

        this.x_now = this.x_now + this.vx + this.ax * dt * dt;
        this.y_now = this.y_now + this.vy + this.ay * dt * dt;

        this.ax = 0;
        this.ay = 0;
    }

    updateAnchor() {
        this.x_now = this.x;
        this.y_now = this.y;
    }

    accelerate(acc_x, acc_y) {
        this.ax += acc_x;
        this.ay += acc_y;
    }
}

class Spring {
    constructor(particle1, particle2, strength, damping, width=0, color="#ffffff") {
        this.p1 = particle1;
        this.p2 = particle2;
        this.length = Math.sqrt((this.p1.x_now - this.p2.x_now)**2 + (this.p1.y_now - this.p2.y_now)**2);
        this.strength = strength;
        this.damping = damping;
        this.color = color;
        this.width = width;
    }

    applyStringForce() {
        let force_x = this.p1.x_now - this.p2.x_now;
        let force_y = this.p1.y_now - this.p2.y_now;

        let force_len = Math.sqrt(force_x**2 + force_y**2)

        let x = force_len - this.length;

        force_x = force_x / force_len;
        force_y = force_y / force_len;

        let vel_dif_x = this.p1.vx - this.p2.vx;
        let vel_dif_y = this.p1.vy - this.p2.vy;

        let damping_force_x = (vel_dif_x + force_x) * this.damping; 
        let damping_force_y = (vel_dif_y + force_y) * this.damping;

        force_x = force_x * this.strength * x + damping_force_x;
        force_y = force_y * this.strength * x + damping_force_y;

        this.p1.accelerate(-force_x*500, -force_y*500);
        this.p2.accelerate(force_x*500, force_y*500);

    }
}

class Joint {
    constructor(particle1, particle2, width=0, color="#ffffff") {
        this.p1 = particle1;
        this.p2 = particle2;
        this.target_dist = Math.sqrt((this.p1.x_now - this.p2.x_now)**2 + (this.p1.y_now - this.p2.y_now)**2) + 1
        this.width = width;
        this.color = color;
    }

    applyJoint() {
        let axis_x = this.p1.x_now - this.p2.x_now;
        let axis_y = this.p1.y_now - this.p2.y_now;

        let dist = Math.sqrt(axis_x**2 + axis_y**2);

        let n_x = axis_x / dist;
        let n_y = axis_y / dist;

        let delta = this.target_dist - dist;

        this.p1.x_now += 0.5 * delta * n_x;
        this.p1.y_now += 0.5 * delta * n_y;
        this.p2.x_now -= 0.5 * delta * n_x;
        this.p2.y_now -= 0.5 * delta * n_y;
    }
}

class Mouse {
    constructor(canvas, x=0, y=0, pickRadius=50) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.down = false;
        this.pickRadius = pickRadius;
        this.closestParticle;
        this.canvas.addEventListener("mousemove", event => this.updatePosition(canvas, event));
        this.canvas.addEventListener("mousedown", () => this.down = true);
        this.canvas.addEventListener("mouseup", () => this.down = false);
    }

    updatePosition(canvas, event) {
        let rect = canvas.getBoundingClientRect(); 
        this.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
        this.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    }

    applyPickUp(particles) {
        let minDist = Infinity;

        if (this.down) {
            if (this.closestParticle != undefined) {
                if (!this.closestParticle.anchored) {
                    this.closestParticle.x_now = this.x;
                    this.closestParticle.y_now = this.y;
                }
            }
        } else {
            this.closestParticle = undefined;
            for (let particle of particles) {
                let dist = Math.sqrt((this.x-particle.x_now)**2 + (this.y - particle.y_now)**2)
                if (dist <= this.pickRadius & dist < minDist) {
                    minDist = dist;
                    this.closestParticle = particle;
                }
            }
        }
    }
}