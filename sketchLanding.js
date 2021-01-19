let whichArwork = 1;
let artwork1;
let artwork2;
let artwork3;
let artwork4;

function preload() {
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background("black");

  fill("white");
  textAlign(CENTER);
  textSize(30);
  text("Click",width/2,height/3);

  loadPreview();
}

function loadPreview() {
  artwork1 = ellipse(width/5,height/2,50);
  artwork2 = ellipse(2*width/5,height/2,50);
  artwork3 = ellipse(3*width/5,height/2,50);
  artwork4 = ellipse(4*width/5,height/2,50);
}

function mouseClicked(artwork1) {
  window.open('artwork1.html', '_self');
}
