class Player {
    
    constructor(radius) {
        this.h = 15;
        this.w = 8;
        this.angle = 0;
        this.r = radius;
        this.speed = 0.2;
    }


    draw(colour) {
        noStroke();
        fill(colour);
        rotate(this.angle);
        triangle(0, this.r + this.h, this.w, this.r, -this.w, this.r)
        rotate(-this.angle);
    }

    rotate(keyCode) {
        keyCode == RIGHT_ARROW ? this.angle += this.speed : this.angle -= this.speed;
        while (this.angle < 0) this.angle += 2 * PI;
        this.angle = this.angle % (2 * PI);
    }

}