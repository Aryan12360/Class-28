class Cannon {
    constructor(x, y, w, h, a) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = a;

        this.cannonBase = loadImage("assets/cannonBase.png");
        this.cannonImage = loadImage("assets/cannon.png");
    }

    display(){
        if(keyIsDown(LEFT_ARROW) && this.a > -50){
            this.a = this.a - 1;
        }
        if(keyIsDown(RIGHT_ARROW) && this.a < 60){
            this.a = this.a + 1;
        }
        push();
        translate(this.x, this.y);
        rotate (this.a);
        imageMode (CENTER);
        image (this.cannonImage, 0, 0, this.w, this.h);
        pop();

        image (this.cannonBase, 40, 30, 200, 200);
        noFill();
    }
}