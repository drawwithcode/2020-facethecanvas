let cnv;
let capture;
let takenPhoto;

let backButton;
let takePhotoButton;
let confirmButton;
let retakePhotoButton;

//Cornici dei quadri, preparo tutte le variabili e poi nel preload chiamo
//solo quella indicata nel passaggio da index(Artwork) a qua (Camera), evitando il peso di caricarle tutte
//sarebbe dispersivo usare Firebase anche per questa cosa perchè è molto pesante e complicato
let frame;
let whichFrame = 1;
let hideFrame = 0;

function preload(){
  loadFrame();
}

function setup() {
  imageMode(CENTER);
  firebaseConfiguration();

  showCanvas();
  showCapture();
  showButtons();
}

function draw() {
  showPhoto();
}

function firebaseConfiguration() {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAg9AWOJiDQsX_dtzvR-WoUntj5NWcdv2k",
    authDomain: "face-the-canvas.firebaseapp.com",
    databaseURL: "https://face-the-canvas-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "face-the-canvas",
    storageBucket: "face-the-canvas.appspot.com",
    messagingSenderId: "828882691849",
    appId: "1:828882691849:web:c9f18389eb5602de5055d8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();

  let ref = database.ref('photos');
  ref.on('value', errData);
}

function errData(err) {
  console.log('Error');
  console.log(err);
}

function loadFrame() {
  //aggiungere if dopo &ricevuto
  console.log(whichFrame);
  frame = loadImage("./assets/images/artwork1/frames/frame"+whichFrame+".png");
}

function showCanvas() {
  cnv = createCanvas(400,400);
  cnv.id("canvas");
}

function showCapture() {
  capture = createCapture(VIDEO);
  capture.id('capture');
  capture.hide();
}

function showPhoto() {
  image(capture, width/2, height/2, width, height);
  if(hideFrame == 0) {
    image(frame, width/2, height/2, width, height);
  }
}

function showButtons() {
  backButton = createButton("BACK TO ARTWORK");
  backButton.mousePressed(openArtwork);

  takePhotoButton = createButton("TAKE PHOTO");
  takePhotoButton.mousePressed(takePhoto);

  confirmButton = createButton("CONFIRM PHOTO");
  confirmButton.mousePressed(confirmPhoto);
  confirmButton.hide();

  retakePhotoButton = createButton("RETAKE PHOTO");
  retakePhotoButton.mousePressed(retakePhoto);
  retakePhotoButton.hide();

  sendButton = createButton("RETURN");
  sendButton.mousePressed(openArtwork);
  sendButton.hide();
}

function takePhoto() {
  hideFrame = 1; //nasconde la cornice prima dell'invio al server
  //non riesco a evitare che non ci sia quando puoi scegliere di rifarla, mi dispice ahah ma non dipende da me

  takenPhoto = createImage(cnv.width,cnv.height);
  takenPhoto.copy(cnv, 0, 0, cnv.width, cnv.height, 0, 0, cnv.width, cnv.height);

  takePhotoButton.hide();
  confirmButton.show();
  retakePhotoButton.show();

  noLoop();
}

function retakePhoto() {
  hideFrame = 0;

  confirmButton.hide();
  retakePhotoButton.hide();
  takePhotoButton.show();

  loop();
}

function confirmPhoto() {
  let canvas = document.getElementById("canvas");
  let dataURL = canvas.toDataURL();
  let data = {
    id: "PROVA",
    photoImage: dataURL
  }
  let ref = database.ref("photos/quadro1");
  ref.push(data);

  backButton.hide();
  confirmButton.hide();
  retakePhotoButton.hide();
  sendButton.show();

  image(frame, width/2, height/2, width, height); //riaggiungo la cornice
}

function openArtwork() {
  //se questo link viene inserito nella funzione confirmPhoto() ci sono problemi col database, che non riceve la foto
  window.open('index.html', '_self');
}
