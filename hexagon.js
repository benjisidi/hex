class Hexagon {
    constructor() {
        this.radius = 700;
        this.updateSpeed = 0.99;
        let startPoint = Math.round(random(0, 7));
        this.sides = [...Array(6).keys()].map(i => (startPoint + i)%6)
    }

    draw() {
        noFill();
        strokeCap(SQUARE);
        stroke(255, 204, 0);
        beginShape();
        strokeWeight(this.radius * 0.1);

        this.sides.forEach(side => {
            let x = this.radius*Math.sin(Math.PI/3*side);
            let y = this.radius*Math.cos(Math.PI/3*side);
            vertex(x, y);
        })
        endShape();
    }

    update() {
        this.radius = this.radius * this.updateSpeed;
    }
 
    setUpdateSpeed(val) {
        this.updateSpeed = val;
    }

    print() {
        this.sides.forEach((vertex, i) => {
            // Don't check the missing side
            if (i < this.sides.length - 1) {
                let nextVertex = this.sides[i+1];
                let startAngle; 
                let endAngle;
                if (vertex == 5) {
                    endAngle = startAngle;
                    startAngle = 0;
                } else {
                    startAngle = 2 * PI - Math.PI/3*nextVertex;
                    endAngle = 2 * PI - Math.PI/3*vertex;
                }
                endAngle == 0 ? endAngle += 2*Math.PI : false;
                console.log(`${vertex} -> ${nextVertex}: ${startAngle} -> ${endAngle}`)
            }
        })
    }
    
}