let hex;
let width = 800;
let height = 800;
let game;
let song;

function preload() {
    // Load a sound file
    song = loadSound('scifi.mp3');
    song.rate(1.5);
  }

  
function setup() {
    createCanvas(width, height);
    game = new Game(width, height, song);
    // song.loop()
}

function draw() {
    translate(width/2, height/2);
    background (0,0,0);
    game.draw();
    game.update();
}
