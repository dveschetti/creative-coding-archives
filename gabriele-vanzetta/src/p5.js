

let video;
let flippedVideo;
let label = "";
let value = "";
let ready = false;

// handpose variables
let handPose;
let hands;
let distance = 71;
let distanceFingers =0;
let timer = 3
let hand;
let shuffle = false;
let zoom = false;
let removeActive = false;
let nextImage = false;
let prevImage = false;

let thumbY = 0;
let middleX = 0;

let middleY = 0;
let ringFingerY = 0;
let indexY = 0;

// variables for order color
let orderColor1 = false;
let orderColor2 = false;
let ringUp = false;
let pinkyUp = false;
let middleUp = false;
let indexUp = false;
let thumbUp = false;



//model ready 
function modelReady() {
  console.log("hand pose loaded");
  handpose.on("predict", gotPose);
}

function gotPose(results) {
  hands = results;
}

function setup() {
  createCanvas(420, 360);
  flippedVideo = createCapture(VIDEO);
  flippedVideo.size(160, 130);
  flippedVideo.hide();
  handpose = ml5.handpose(flippedVideo, modelReady);
  // classifyVideo();
}

function draw() {
  ready = true;
  background(220, 220, 220);

  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
  }



    //   //if hand exist
    if (hands && hands.length > 0) {
      hand = hands[0];

      let landmarks = hand.landmarks;
      fill(0);
      stroke(0);
      for (let i = 0; i < landmarks.length; i++) {
        /*
        Here we draw the hand joints
        */
        let [x, y, z] = landmarks[i];
        ellipse(x, y, 5);
        text(i, x + 10, y + 10);
      }

      //   // drawing the hand skeleton
      let annotations = hand.annotations;
      let parts = Object.keys(annotations);

      for (let part of parts) {
        for (let position of annotations[part]) {
          stroke(0);
          strokeWeight(1);
          noFill();
          beginShape();
          for (let position of annotations[part]) {
            let [x, y, z] = position;
            vertex(x, y);
          }
          endShape();
        }
      }
      distance = dist(
        annotations.thumb[3][0],
        annotations.thumb[3][1],
        annotations.pinky[2][0],
        annotations.pinky[1][1]
      );

      distanceFingers = dist(
        annotations.middleFinger[3][0],
        annotations.middleFinger[3][1],
        annotations.ringFinger[3][0],
        annotations.ringFinger[3][1]
      ) 

      // if the hand is open ZOOM
      if (distanceFingers > 90) {
        console.log("daje")
        zoom = true;
      }
      else {
        zoom = false;
      }
      
      // if the hand is close SHUFFLE
      shuffle = false;
      
      if(distance < 80){
        shuffle = true;
      }
      else {
        shuffle = false;
      }

      // VARIABLES PREV/NEXT
      thumbY = annotations.thumb[3][1];
      middleX = annotations.middleFinger[3][0];
      middleY = annotations.middleFinger[2][1]
      middleY2 = annotations.middleFinger[1][1]
      ringFingerY = annotations.ringFinger[3][1]
      indexY = annotations.indexFinger[3][1]


      // index finger down NEXT
       if ( indexY > middleY && zoom == true) {
          console.log("next");
          nextImage = true;
          prevImage = false;
       }

       else {
        nextImage = false;
       }

       //ring finger down PREV
       if ( ringFingerY > middleY2 && zoom == true) {
        console.log("prev");
        prevImage = true;
        nextImage = false;
       }
       else{
        prevImage = false;
       }

       // variables SORT 
       pinkyUp = annotations.pinky[3][1]
       ringUp = annotations.ringFinger[3][1]
       middleUp = annotations.middleFinger[3][1]
       indexUp = annotations.indexFinger[3][1]
       thumbUp = annotations.thumb[3][1]

       if (middleUp > indexUp && middleUp > thumbUp){
        orderColor1 = true;
       }
       else {
        orderColor1 = false;
       }

    }
  
}
// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  confidence = results[0].confidence;
  classifyVideo();
}
