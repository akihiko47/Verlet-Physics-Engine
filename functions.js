function draw_particles(content, particles) {
    for (let particle of particles) {
        content.beginPath();
        content.arc(particle.x_now, particle.y_now, particle.radius-1, 0, 2 * Math.PI, false);
        content.fillStyle = particle.color;
        content.fill();
    }
}

function draw_springs(content, springs) {
    for (let spring of springs) {
        content.beginPath();
        content.moveTo(spring.p1.x_now, spring.p1.y_now);
        content.lineTo(spring.p2.x_now, spring.p2.y_now);
        content.lineWidth = 5;
        content.strokeStyle = "rgb(0, 255, 0)";
        content.stroke();
    }
}

function apply_gravity(particles, G) {
    for (let particle of particles) {
        particle.accelerate(0, G);
	}
}

function apply_springs(springs) {
    for (let spring of springs) {
        spring.applyStringForce();
    }
}

function apply_joints(joints) {
    for (let joint of joints) {
        joint.applyJoint();
    }
}

function update_positions(particles, dt) {
    for (let particle of particles) {
        particle.update(dt);
    }
}

function apply_constraint(content, particles) {

    content.fillStyle = wallsColor;
    content.fillRect(0, 0, width, height);

    content.fillStyle = grd;
    content.fillRect(borderSize, borderSize, width - 2*borderSize, height - 2*borderSize);

    for (let particle of particles) {
        if (particle.x_now + particle.radius > width - borderSize) {
            particle.x_now = width - borderSize - particle.radius;
        }
        if (particle.x_now - particle.radius < borderSize) {
            particle.x_now = particle.radius + borderSize;
        }
        if (particle.y_now + particle.radius > height - borderSize) {
            particle.y_now = height - particle.radius - borderSize;
        }
        if (particle.y_now - particle.radius < borderSize) {
            particle.y_now = particle.radius + borderSize;
        }
    }
}

function handle_between_collision(particles) {
    for (let particle1 of particles) {
        for (let particle2 of particles) {
            if (particle1 !== particle2) {
                let col_axis_x = particle1.x_now - particle2.x_now;
                let col_axis_y = particle1.y_now - particle2.y_now;

                let dist = Math.sqrt(col_axis_x**2 + col_axis_y**2);

                if (dist < particle1.radius + particle2.radius) {
                    let n_x = col_axis_x / dist;
                    let n_y = col_axis_y / dist;

                    let delta = particle1.radius + particle2.radius - dist;

                    particle1.x_now += 0.5 * delta * n_x;
                    particle1.y_now += 0.5 * delta * n_y;
                    particle2.x_now -= 0.5 * delta * n_x;
                    particle2.y_now -= 0.5 * delta * n_y;
                }
            }
        }
    }
}
