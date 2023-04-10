class Cannonball {
    constructor(x, y) {
        var ball_options = {
            isStatic: true
        }
        this.radius = 25;
        this.ballImage = loadImage("assets/cannonball.png");

        this.speed = 0.05;
        this.animation = [this.ballImage];

        this.isSink = false;

        this.body = Bodies.circle(x, y, this.radius, ball_options);
        World.add(world, this.body);

        this.trajectory = [];
    }

    animate() {
        this.speed += 0.05;
    }

    remove(c) {
        Matter.Body.setVelocity(this.body, {
            x: 0,
            y: 0
        });
        this.speed = 0.05;
        this.isSink = true;
        this.radius = 150;
        this.animation = waterSplashAnimation;
        setTimeout(() => {
            World.remove(world, this.body);
            delete balls[c];
        }, 1000)

    }
    shoot() {
        var newAngle = cannon.a - 30;

        newAngle = newAngle * (3.14 / 180);
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body, false);
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180 / 3.14),
            y: velocity.y * (180 / 3.14)
        })

    }

    display() {
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);
        push();
        imageMode(CENTER);
        image(this.animation[index], pos.x, pos.y, this.radius, this.radius);
        pop();

        if (this.body.velocity.x > 0 && this.body.position.x > 210) {
            var p = [pos.x, pos.y];
            this.trajectory.push(p);
        }

        for (var i = 0; i < this.trajectory.length; i++) {
            image(this.ballImage, this.trajectory[i][0], this.trajectory[i][1], 5, 5);

        }

        if (pos.y > 520) {
            this.trajectory = [];
        }
    }
}