function drawEntities(content, particles=[], springs=[], joints=[]) {
    drawJoints(content, joints);
    drawSprings(content, springs);
    drawParticles(content, particles);
}

function drawParticles(content, particles) {
    for (let particle of particles) {
        if (particle.radius) {
            content.beginPath();
            content.arc(particle.x_now, particle.y_now, particle.radius-1, 0, 2 * Math.PI, false);
            content.fillStyle = particle.color;
            content.fill();
        }
    }
}

function drawSprings(content, springs) {
    for (let spring of springs) {
        if (spring.width) {
            content.beginPath();
            content.moveTo(spring.p1.x_now, spring.p1.y_now);
            content.lineTo(spring.p2.x_now, spring.p2.y_now);
            content.lineWidth = spring.width;
            content.strokeStyle = spring.color;
            content.stroke();
        }
    }
}

function drawJoints(content, joints) {
    for (let joint of joints) {
        if (joint.width) {
            content.beginPath();
            content.moveTo(joint.p1.x_now, joint.p1.y_now);
            content.lineTo(joint.p2.x_now, joint.p2.y_now);
            content.lineWidth = joint.width;
            content.strokeStyle = joint.color;
            content.stroke();
        }
    }
}

function applyGravity(particles, G) {
    for (let particle of particles) {
        particle.accelerate(0, G * 100);
	}
}

function update(particles, springs, joints, dt) {
    updatePositions(particles, dt);
    handleBetweenCollision(particles);
    applySprings(springs);
    applyJoints(joints);
}

function applySprings(springs) {
    for (let spring of springs) {
        spring.applyStringForce();
    }
}

function applyJoints(joints) {
    for (let joint of joints) {
        joint.applyJoint();
    }
}

function updatePositions(particles, dt) {
    for (let particle of particles) {
        if (!particle.anchored) {
            particle.update(dt);
        } else {
            particle.updateAnchor();
        }
    }
}

function applyConstraint(particles, width, height) {
    for (let particle of particles) {
        if (particle.x_now + particle.radius > width) {
            particle.x_now = width - particle.radius;
        }
        if (particle.x_now - particle.radius < 0) {
            particle.x_now = particle.radius;
        }
        if (particle.y_now + particle.radius > height) {
            particle.y_now = height - particle.radius;
        }
        if (particle.y_now - particle.radius < 0) {
            particle.y_now = particle.radius;
        }
    }
}

function handleBetweenCollision(particles) {
    for (let particle1 of particles) {
        for (let particle2 of particles) {
            if ((particle1 !== particle2) & (particle1.radius != 0 & particle2.radius != 0)) {
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
