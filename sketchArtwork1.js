var allPhotos = [];
var loading = 0;

//per fare in modo che nella camera ci sia la giusta cornice e che la foto vada nella giusta sottocartella nel database
const urlString = window.location.href;
const url = new URL(urlString);
var currentArtwork = 1; //quadro attuale, serve per Camera per le cartelle nel preload
var selectedFrame = 1; //per openCamera(). Per ora =1 per avanzamento, ma poi da collegare con click specifico

function preload() {
  firebaseConfiguration();
  loading = 1;
}

function setup() {
  //imageMode(CENTER);
  createCanvas(windowWidth,400);
  background(200);

  button = createButton("CAMERA");
  button.mousePressed(openCamera);
}

function draw() {
  if(loading==2){
    showImages();
  }
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

function showImages() {
  //Ciclo for che usa la lunghezza dell'array allImages deve aspettare che l'array si riempia,
  // quindi la funzione va chiamata nella funzione gotData().

  // console.log(allPhotos[2]);
  for (let i=0; i < allPhotos.length; i++) {
    //console.log(allPhotos[i]);
    image(allPhotos[i],80*i,0,80,80);
  }
}

function openCamera() {
  window.open('camera.html', '_self');
  // window.open(url.origin + "/camera.html?selectedFrame="+selectedFrame+"&currentArtwork="+currentArtwork, '_self');
}
