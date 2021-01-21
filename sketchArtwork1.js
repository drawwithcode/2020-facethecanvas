let cnv;
var allPhotos = [];
let cuttedArtwork;
let faceData;
var loading = 0;

//per fare in modo che nella camera ci sia la giusta cornice e che la foto vada nella giusta sottocartella nel database
const urlString = window.location.href;
const url = new URL(urlString);
var currentArtwork = 1; //quadro attuale, serve per Camera per le cartelle nel preload
var selectedFrame = 0; //per openCamera(). Per ora =1 per avanzamento, ma poi da collegare con click specifico

let logo;
let p;

function preload() {
  //firebaseConfiguration();
  cuttedArtwork = loadImage("./assets/images/artwork"+currentArtwork+"/cutted"+currentArtwork+".png");
  loadFaceData();
  loading = 1;
}

function setup() {
  imageMode(CENTER);
  showCanvas();
  background("black");

  button = createButton("CAMERA");
  button.mousePressed(openCamera);
  p = createP("Paragrafo");
  logo = createElement("h1","Titolo");

}

function draw() {
  if(loading==2){
    // showImages();
  };
  image(cuttedArtwork,width/2,height/2,width,height);
  showAddedFaces();
  assignSelectedFrame()
  // noLoop();
}

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

  let ref = database.ref('photos/quadro1');
  ref.once('value', gotData, errData);
}

function gotData(data) {
  var scores = data.val();
  var keys = Object.keys(scores);
  //console.log(keys);

  for (let i=0; i < keys.length; i++) {
    let k = keys[i];
    let id = scores[k].id;
    let photoImage = scores[k].photoImage;
    allPhotos[i] = loadImage(photoImage);
    console.log(allPhotos.length + "Hello");
  }
  loading = 2;
}

function errData(err) {
  console.log("Error");
  console.log(err);
}

function loadFaceData() {
  faceData = loadJSON("./assets/faces1.json");
}

function showCanvas() {
  if(windowWidth>windowHeight){
    cnv = createCanvas(windowHeight*0.9, windowHeight*0.9);
  } else {
    cnv = createCanvas(windowWidth*0.9, windowWidth*0.9);
  }
  cnv.id("canvas");
}

function showImages() {
  //Ciclo for che usa la lunghezza dell'array allImages deve aspettare che l'array si riempia,
  // quindi la funzione va chiamata nella funzione gotData().

  // console.log(allPhotos[2]);
  for (let i=0; i < allPhotos.length; i++) {
    //console.log(allPhotos[i]);
    image(allPhotos[i],80*i,0,80,80);
  }
}

function showAddedFaces() {
  for (let i=0; i < faceData.faces.length; i++) {
    ellipse((faceData.faces[i].positionX)*width,(faceData.faces[i].positionY)*height,50);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(i,(faceData.faces[i].positionX)*width,(faceData.faces[i].positionY)*height);
  }
}

function assignSelectedFrame() {
  if (dist(mouseX, mouseY, (faceData.faces[1].positionX)*width,(faceData.faces[1].positionY)*height) < 50) {
    selectedFrame = 1;
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
