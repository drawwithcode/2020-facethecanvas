let whichArwork = 1;

function setup() {
  createCanvas(windowWidth,windowHeight);
  background("black");
  fill("white");
  textAlign(CENTER);
  textSize(100);
  text("Click",width/2,height/2);
}
function mouseClicked() {
  //se questo link viene inserito nella funzione confirmPhoto() ci sono problemi col database, che non riceve la foto
  window.open('artwork'+whichArwork+'.html', '_self');
}
