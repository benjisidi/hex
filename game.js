class Game {
    constructor(width, height, music) {
        this.width = width;
        this.height = height;
        this.hexagons = [];
        this.spacing = 150;
        this.speed = 0.99;
        this.minSpacing = 300;
        this.maxSpeed = 0.98;
        this.rotation = 0;
        this.rotationDirection = 1;
        this.playerRadius = 95
        this.player = new Player(this.playerRadius);
        this.colour = [255, 204, 0];
        this.bgColour1 = [60, 60, 120];
        this.bgColour2 = [50, 50, 50];
        this.playing = true;
        this.time = 0;
        this.bestTime = 0;
        this.music = music;
        this.music.loop();
        this.framecount = 0;
        this.input = true;
        this.runStart = millis();
    }

    update() {
        if (keyIsDown(77) && this.input){
            if (this.music.isPlaying()) {
                this.music.pause();
            } else {
                this.music.loop();
            }
            console.log("Toggling music", this.framecount, this.input)
            this.input = false;
        } 
        if (this.hexagons.length > 0) {
            this.checkCollisions();
        }
        if (this.playing) {
            if (this.hexagons.length == 0 || (this.hexagons[this.hexagons.length -1].radius < this.spacing && (random() > .98 || this.hexagons.length < 3))) {
                this.hexagons.push(new Hexagon());
            }
            for (let i = this.hexagons.length -1 ; i > -1; i--) {
                if (this.hexagons[i].radius < this.playerRadius) {
                    this.hexagons.splice(i, 1);
                } else {
                    this.hexagons[i].setUpdateSpeed(this.speed);
                }
            }
            this.spacing = this.spacing > this.minSpacing ? this.minSpacing : this.spacing + 0.1;
            this.speed = this.speed < this.maxSpeed ? this.maxSpeed : this.speed - 0.00001;
            this.rotation += 0.02 * this.rotationDirection;
            if (random() > 0.99) {this.rotationDirection = -1 * this.rotationDirection};
    
            if (keyIsDown(RIGHT_ARROW)) {
                this.player.rotate(RIGHT_ARROW)
            } else if (keyIsDown(LEFT_ARROW)) {
                this.player.rotate(LEFT_ARROW)
            }

            this.hexagons.forEach(hex => hex.update());
            this.time = millis() - this.runStart;
        } else {
            if (keyIsDown(32)) { // spacebar
                this.restart()
            }
        }
        if (!this.input) {
            this.framecount += 1;
            this.framecount = this.framecount % 20;
        }
        if (this.framecount == 0) this.input = true;

    }


    draw() {
        rotate(this.rotation);
        this.drawBackground();
        this.drawCentre();
        this.hexagons.forEach(hex => hex.draw(this.colour))
        this.player.draw(this.colour);
        if (!this.playing) this.showEndText();
        this.drawTime();
    }

    // Draw hexagon in the middle
    drawCentre() {
        let weight = 8;
        fill(this.bgColour1);
        strokeWeight(weight);
        stroke(this.colour);
        beginShape();
        [0,1,2,3,4,5,6].forEach(i => {
            let angle = i * PI/3;
            vertex((this.playerRadius - weight) *sin(angle), (this.playerRadius - weight)*cos(angle));
        })
        endShape(CLOSE);
    }

    drawBackground() {
        let hexRad = Math.sqrt(Math.pow((this.width/2), 2) + Math.pow((this.height/2), 2));

        [0,1,2,3,4,5,6].forEach(i => {
            let color = [this.bgColour1, this.bgColour2][i%2];
            fill(color);
            noStroke();
            let angle = i * PI/3; 
            triangle(0, 0, hexRad * this.height*Math.sin(angle), hexRad * this.width*Math.cos(angle), hexRad * this.height*Math.sin(angle + PI/3), hexRad * this.width*Math.cos(angle + PI/3))
        })
    }

    checkCollisions() {
        let closestHex = this.hexagons[0];
        let playerRadius = this.player.r + this.player.h
        let playerAngle = 2*PI - this.player.angle;
        // If the hex is in place to hit the player
        if (closestHex.radius * 0.9 <= playerRadius && playerRadius <= closestHex.radius * 1.1) {
            // console.log(`PlayerAngle: ${playerAngle}`)
            closestHex.sides.forEach((vertex, i) => {
                // Don't check the missing side
                if (i < closestHex.sides.length - 1) {
                    let nextVertex = closestHex.sides[i+1];
                    let startAngle; 
                    let endAngle;
                    if (vertex == 5) {
                        startAngle = Math.PI/3*vertex;;
                        endAngle = Math.PI*2;
                    } else {
                        startAngle = Math.PI/3*vertex;
                        endAngle = Math.PI/3*nextVertex;
                    }
                    endAngle == 0 ? endAngle += 2*Math.PI : false;
                    // console.log(`${vertex} -> ${nextVertex}: ${startAngle} -> ${endAngle}`)
                    if (startAngle <= playerAngle && playerAngle <= endAngle) {
                        // console.log('Hit sides ', vertex, nextVertex)
                        strokeWeight(3);
                        stroke(255);
                        this.playing = false;
                    }
                }
            })
        }
    }
    
    showEndText() {
        rotate(-this.rotation);
        textSize(64);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        fill(255);
        stroke(0);
        strokeWeight(5);
        text('Game Over\nSpace to restart.', 0, 0);
        rotate(this.rotation);
    }

    restart() {
        console.log('restart')
        this.playing = true;
        this.hexagons = [];
        this.spacing = 150;
        this.speed = 0.99;
        if (this.time > this.bestTime) this.bestTime = this.time;
        this.runStart = millis();
    }

    drawTime() {
        rotate(-this.rotation);
        textSize(16);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        fill(255);
        stroke(0);
        strokeWeight(5);
        text('Current: ' + nf(this.time/1000, 3, 2), -this.width/2 + 10, -this.height/2 + 30);
        text('Best: ' + nf(this.bestTime/1000, 3, 2), -this.width/2 + 10, -this.height/2 + 50);
        rotate(this.rotation);
    }
}