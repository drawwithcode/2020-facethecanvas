let cnv;
var allPhotos1 = [];
var allPhotos2 = [];
var allPhotos3 = [];
var allPhotos4 = [];
var allPhotos5 = [];
var allPhotos6 = [];
let cuttedArtwork;
let faceData;
var loading = 0;
let loadingText = "Loading canvas..."
let homeButton;

//per fare in modo che nella camera ci sia la giusta cornice e che la foto vada nella giusta sottocartella nel database
const urlString = window.location.href;
const url = new URL(urlString);
var currentArtwork = 2; //quadro attuale, for Camera
var selectedFrame = 0; //per openCamera()

let logo;
let p;

function preload() {
  firebaseConfiguration();
  cuttedArtwork = loadImage("./assets/images/artwork"+currentArtwork+"/cutted"+currentArtwork+".png");
  loadFaceData();
  loading = 1;
}

function setup() {
  imageMode(CENTER);
  showCanvas();
  background("black");

  p = createP("The effect of the fresco has often been judged more eloquent than poetic, with the evidence of the declamatory attitudes of the poets with which Sanzio wanted to give an idea of the different poetic genres (tragic, lyric, epic). The figures have an accentuated sculptural relief, justified by the backlit position of the fresco and by the need therefore to balance the real light effect. Raffaello Sanzio – 1510-1511 – Stanza della Segnatura");
  logo = createElement("h1","Click on the selected spaces, make your expression with the camera and join the Parnassus!");
  homeButton = createButton("HOME PAGE");
  homeButton.mousePressed(openIndex);

}

function draw() {
  if(loading==1) {
    showLoading();
  }

  if(loading==2){
    background("black");
    showPhotos();
    image(cuttedArtwork,width/2,height/2,width,height);
    // showOver();
    loading = 3;
  };

  if(loading==3) {
    assignSelectedFrame();
  }
}

//FIREBASE
function firebaseConfiguration() {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyD141zbYjuFt7VCrp9QocPYA6bJfhwZZkQ",
    authDomain: "facethecanvas.firebaseapp.com",
    databaseURL: "https://facethecanvas-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "facethecanvas",
    storageBucket: "facethecanvas.appspot.com",
    messagingSenderId: "667902225848",
    appId: "1:667902225848:web:246cd990165ea8369c334d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();

  let ref1 = database.ref('photos/artwork2/face1');
  ref1.once('value', gotData1, errData);

  let ref2 = database.ref('photos/artwork2/face2');
  ref2.once('value', gotData2, errData);

  let ref3 = database.ref('photos/artwork2/face3');
  ref3.once('value', gotData3, errData);

  let ref4 = database.ref('photos/artwork2/face4');
  ref4.once('value', gotData4, errData);

  let ref5 = database.ref('photos/artwork2/face5');
  ref5.once('value', gotData5, errData);

  let ref6 = database.ref('photos/artwork2/face6');
  ref6.once('value', gotData6, errData);
}

//an array for every face, with all the photos of that face
//FACES
function gotData1(data) {
  let scores = data.val();
  let keys = Object.keys(scores);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos1[i] = loadImage(photoImage);
    console.log("artwork2/face1 loaded="+allPhotos1.length);
  }

}

function gotData2(data) {
  let scores = data.val();
  let keys = Object.keys(scores);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos2[i] = loadImage(photoImage);
    console.log("artwork2/face2 loaded="+allPhotos2.length);
  }

}

function gotData3(data) {
  let scores = data.val();
  let keys = Object.keys(scores);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos3[i] = loadImage(photoImage);
    console.log("artwork2/face3 loaded="+allPhotos3.length);
  }

}

function gotData4(data) {
  let scores = data.val();
  let keys = Object.keys(scores);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos4[i] = loadImage(photoImage);
    console.log("artwork2/face4 loaded="+allPhotos4.length);
  }

}

function gotData5(data) {
  let scores = data.val();
  let keys = Object.keys(scores);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos5[i] = loadImage(photoImage);
    console.log("artwork2/face5 loaded="+allPhotos5.length);
  }
}

function gotData6(data) {
  let scores = data.val();
  let keys = Object.keys(scores);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos6[i] = loadImage(photoImage);
    console.log("artwork2/face6 loaded="+allPhotos6.length);
  }

  loading = 2;
}
//FACES

function errData(err) {
  console.log("Error");
  console.log(err);
}
//FIREBASE

function loadFaceData() {
  faceData = loadJSON("./assets/faces2.json");
}

function showCanvas() {
  if(windowWidth>windowHeight){
    cnv = createCanvas(windowHeight*0.9, windowHeight*0.9);
  } else {
    cnv = createCanvas(windowWidth*0.9, windowWidth*0.9);
  }
  cnv.id("canvas");
}

function showLoading() {
  push();
  fill("black");
  noStroke();
  ellipse(width/2,height/2,100);
  pop();

  push();
  textAlign(CENTER,CENTER);
  fill(255);
  textSize(30);
  textFont("Quicksand");
  text(loadingText,width/2,height/2-60);
  pop();

  let slowFrameCount = frameCount*0.2;
  push();
  noFill();
  stroke("white");
  strokeWeight(8);
  arc(width/2,height/2,40,40,slowFrameCount,(240+slowFrameCount),DEGREES);
  pop();
}

function showPhotos() {
  // if (allPhotos1.length >= 2) {
  //   let lastAddedFace = allPhotos1.length-1;
  //   console.log("Added faces="+(lastAddedFace+1));
  //   image(allPhotos1[lastAddedFace],(faceData.faces[1].positionX)*width,(faceData.faces[1].positionY)*height,width/8,width/8);
  // }

  if (allPhotos2.length >= 2) {
    let lastAddedFace = allPhotos2.length-1;
    console.log("Added faces="+(lastAddedFace+1));
    image(allPhotos2[lastAddedFace],(faceData.faces[2].positionX)*width,(faceData.faces[2].positionY)*height,width/8,width/8);
  }

  if (allPhotos3.length >= 2) {
    let lastAddedFace = allPhotos3.length-1;
    console.log("Added faces="+(lastAddedFace+1));
    image(allPhotos3[lastAddedFace],(faceData.faces[3].positionX)*width,(faceData.faces[3].positionY)*height,width/8,width/8);
  }

  if (allPhotos4.length >= 2) {
    let lastAddedFace = allPhotos4.length-1;
    console.log("Added faces="+(lastAddedFace+1));
    image(allPhotos4[lastAddedFace],(faceData.faces[4].positionX)*width,(faceData.faces[4].positionY)*height,width/8,width/8);
  }

  if (allPhotos5.length >= 2) {
    let lastAddedFace = allPhotos5.length-1;
    console.log("Added faces="+(lastAddedFace+1));
    image(allPhotos5[lastAddedFace],(faceData.faces[5].positionX)*width,(faceData.faces[5].positionY)*height,width/8,width/8);
  }

}

function showOver() {
  for (let i=0; i < faceData.faces.length; i++) {
    ellipse((faceData.faces[i].positionX)*width,(faceData.faces[i].positionY)*height,50);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(i,(faceData.faces[i].positionX)*width,(faceData.faces[i].positionY)*height);
  }
}

function assignSelectedFrame() {
  if (dist(mouseX, mouseY, (faceData.faces[1].positionX)*width,(faceData.faces[1].positionY)*height) < 50) {
    selectedFrame = 0;
  } else if (dist(mouseX, mouseY, (faceData.faces[2].positionX)*width,(faceData.faces[2].positionY)*height) < 50) {
    selectedFrame = 2;
  } else if (dist(mouseX, mouseY, (faceData.faces[3].positionX)*width,(faceData.faces[3].positionY)*height) < 50) {
    selectedFrame = 3;
  } else if (dist(mouseX, mouseY, (faceData.faces[4].positionX)*width,(faceData.faces[4].positionY)*height) < 50) {
    selectedFrame = 4;
  } else if (dist(mouseX, mouseY, (faceData.faces[5].positionX)*width,(faceData.faces[5].positionY)*height) < 50) {
    selectedFrame = 5;
  } else {
    selectedFrame = 0;
  }

  console.log(selectedFrame);
  if(selectedFrame != 0) {
    cnv.mousePressed(openCamera);
  } else {
    cnv.mousePressed(openNothing);
  }
}

function openNothing() {
  console.log("CLICK ON A FACE");
}

function openCamera() {
  // window.open('camera.html', '_self');

  //PER PROVE CON P5.JS TOOLBAR USA QUESTO, IL SECONDO PER GITHUB
  // window.open(url.origin + "/camera.html?selectedFrame="+selectedFrame+"&currentArtwork="+currentArtwork, '_self');
  window.open(url.origin + "/2020-facethecanvas/camera.html?selectedFrame="+selectedFrame+"&currentArtwork="+currentArtwork, '_self');
}

function openIndex() {
  window.open('index.html', '_self');
}
