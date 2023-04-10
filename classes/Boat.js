class Boat {
  constructor(x, y, w, h, boatPos, boatAnimation) {
    this.body = Bodies.rectangle(x, y, w, h);
    this.image = loadImage("assets/boat.png");
    this.w = w;
    this.h = h;
    this.boatPos = boatPos;
    this.animation = boatAnimation;
    this.speed = 0.05;
    this.isBroken = false;
    World.add(world, this.body);
  }

  animate() {
    this.speed += 0.05
  }
  remove(i) {
    this.animation = brokenBoatAnimation;
    this.isBroken = true;
    this.w = 350;
    this.h = 350;
    this.speed = 0.05;
    setTimeout(() => {
      World.remove(world, boats[i].body);
      delete boats[i];
    }, 2000);
  }
  show() {
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);

    push();
    translate(pos.x, pos.y);
    imageMode(CENTER);
    image(this.animation[index], 0, this.boatPos, this.w, this.h);
    pop();
  }
}