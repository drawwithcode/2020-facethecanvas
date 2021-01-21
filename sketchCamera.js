let cnv;
let capture;
let takenPhoto;

let backButton;
let takePhotoButton;
let confirmButton;
let retakePhotoButton;

let frame;
const urlString = window.location.href;
const url = new URL(urlString);
let whichArwork = url.searchParams.get("currentArtwork"); //serve per cartella per la cornice e per openArtwork();
let whichFrame = url.searchParams.get("selectedFrame"); //serve per la cornice
let hideFrame = 0;

//NODE
let poseNet;
let pose;
let faceData;
let correctRightEye = {
  x: 0,
  y: 0,
};
let correctLeftEye = {
  x: 0,
  y: 0,
};
let correctNose  = {
  x: 0,
  y: 0,
};
let distRightEye;
let distLeftEye;
let distNose;
let overlapRightEye;
let overlapLeftEye;
let overlapNose;
let hidePose = 0;

function preload(){
  loadFrame();
  loadFaceData();
}

function setup() {
  imageMode(CENTER);
  firebaseConfiguration();

  showCanvas();
  showCapture();
  loadPose();
  showButtons();
}

function draw() {
  showPhoto();
  if(hidePose == 0) {
    showPose();
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

  let ref = database.ref('photos');
  ref.on('value', errData);
}

function errData(err) {
  console.log('Error');
  console.log(err);
}
//FIREBASE

//POSENET
function loadPose() {
  //dobbiamo invertire gli occhi per scale del capure, la trasformazione scale non permette a Node di funzionare
  correctRightEye.x = (faceData.faces[whichFrame].rightEyeX)*width;
  correctRightEye.y = (faceData.faces[whichFrame].rightEyeY)*height;

  correctLeftEye.x = (faceData.faces[whichFrame].leftEyeX)*width;
  correctLeftEye.y = (faceData.faces[whichFrame].leftEyeY)*height;

  correctNose.x = (faceData.faces[whichFrame].noseX)*width;
  correctNose.y = (faceData.faces[whichFrame].noseY)*height;

  poseNet = ml5.poseNet(capture, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses)  {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}
//POSENET

function loadFrame() {
  //aggiungere if dopo &ricevuto
  console.log(whichFrame);
  frame = loadImage("./assets/images/artwork"+whichArwork+"/frames/frame"+whichFrame+".png");
}

function loadFaceData() {
  faceData = loadJSON("./assets/faces"+whichArwork+".json");
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
  image(capture, width/2, height/2, 0, height);
  if(hideFrame == 0) {
    image(frame, width/2, height/2, width, height);
  }
}

function showPose() {

  strokeWeight(10);
  noFill();

  if(pose) {
    ellipse(pose.nose.x,pose.nose.y,10);
    ellipse(pose.rightEye.x,pose.rightEye.y,10);
    ellipse(pose.leftEye.x,pose.leftEye.y,10);

    distNose = dist(pose.nose.x, pose.nose.y, correctNose.x,correctNose.y);
    distRightEye = dist(pose.rightEye.x, pose.rightEye.y, correctRightEye.x, correctRightEye.y);
    distLeftEye = dist(pose.leftEye.x, pose.leftEye.y, correctLeftEye.x, correctLeftEye.y);

    if(distRightEye<100) {
      push();
      stroke("#2ECC71");
      ellipse(correctRightEye.x, correctRightEye.y, 50);
      pop();
      overlapRightEye = 1;
    } else {
      push();
      stroke("red");
      ellipse(correctRightEye.x, correctRightEye.y, 50);
      pop();
      overlapRightEye = 0;
    }

    if(distLeftEye<100) {
      push();
      stroke("#2ECC71");
      ellipse(correctLeftEye.x, correctLeftEye.y, 50);
      pop();
      overlapLeftEye = 1;
    } else {
      push();
      stroke("red");
      ellipse(correctLeftEye.x, correctLeftEye.y, 50);
      pop();
      overlapLeftEye = 0;
    }

    if(distNose<100) {
      push();
      stroke("#2ECC71");
      ellipse(correctNose.x, correctNose.y, 50);
      pop();
      overlapNose = 1;
    } else {
      push();
      stroke("red");
      ellipse(correctNose.x, correctNose.y, 50);
      pop();
      overlapNose = 0;
    }
  }

  if(overlapRightEye==1 || overlapLeftEye==1 || overlapNose==1) {
    takePhotoButton.mousePressed(takePhoto);
  }

}

function showButtons() {
  poseText = createP("Match your eyes and nose with the circles");
  poseText.id("poseText");

  backButton = createButton("BACK TO ARTWORK");
  backButton.mousePressed(openArtwork);
  backButton.id("backButton");

  takePhotoButton = createButton("TAKE PHOTO");
  takePhotoButton.id("takePhotoButton");

  confirmButton = createButton("CONFIRM PHOTO");
  confirmButton.mousePressed(confirmPhoto);
  confirmButton.hide();
  confirmButton.id("confirmButton");

  retakePhotoButton = createButton("RETAKE PHOTO");
  retakePhotoButton.mousePressed(retakePhoto);
  retakePhotoButton.hide();
  retakePhotoButton.id("retakePhotoButton");

  sendButton = createButton("RETURN");
  sendButton.mousePressed(openArtwork);
  sendButton.hide();
  sendButton.id("sendButton");

}

function takePhoto() {
  hidePose = 1;
  hideFrame = 1; //nasconde la cornice prima dell'invio al server
  //non riesco a evitare che non ci sia quando puoi scegliere di rifarla, mi dispice ahah ma non dipende da me

  takenPhoto = createImage(cnv.width,cnv.height);
  takenPhoto.copy(cnv, 0, 0, cnv.width, cnv.height, 0, 0, cnv.width, cnv.height);

  takePhotoButton.hide();
  poseText.hide();
  confirmButton.show();
  retakePhotoButton.show();

  noLoop();
}

function retakePhoto() {
  hideFrame = 0;

  confirmButton.hide();
  retakePhotoButton.hide();
  takePhotoButton.show();
  poseText.show();

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
