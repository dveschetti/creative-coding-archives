let classifier;

let video;
let flippedVideo;
let label = "";
let value = "";
let ready = false;

let poseNet;
let poses = [];
let random = false;
let preview = false;
let dxT = false;
let dxC = false;
let dxB = false;
let sxT = false;
let sxC = false;
let sxB = false;
let front = false;
let nextW = false;

function setup() {
  createCanvas(320, 260);
  /*
  With this function we are able to activate the computer camera.
  We initialise the camera and tell them the size
  */
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  /*
  Here we send the room data directly to posenet.
  Pose net is a function of ml5 that recognises the human body.
  The results will be passed to the pose variable
  */
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
}

/*
This function confirms that ml5 is correctly loaded.
*/
function modelReady() {
  console.log("Model Loaded");
}

function draw() {
  background(0);

  //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
  
  // Draw the video
  //image(video, 0, 0);

  //grid canvas
  push();
  stroke(100);
  stroke(30,30,30);
  noFill();
  line(width / 3, 0, width / 3, height);
  line(width / 1.5, 0, width / 1.5, height);
  line(0, height / 3, width, height / 3);
  line(0, height / 1.5, width, height / 1.5);
  pop();

  ready= true;
  drawKeypoints();

}

//face recognition
function drawKeypoints() {
  let i = 0;
  /*
  If pose net recognises a person.
  */
  if (poses[0]) {
    /*
    We can get the position of the body
    */
    let pose = poses[i].pose;

    let nose = pose.nose;
    let LeftEye = pose.leftEye;
    let rightEye = pose.righttEye;

    /*
    We can calculate the distance of the human from the computer 
    by making a calculation that understands the space       
    between the nose and the eye.
    */
    distance = dist(LeftEye.x, LeftEye.y, nose.x, nose.y);
    //console.log(distance);
    //set nose position to start preview
    if (distance < 30){
      preview = true;
      random = false;
      dxT = false;
      dxC = false;
      dxB = false;
      sxT = false;
      sxC = false;
      sxB = false;
      front = false;
      //console.log(distance);
    }
    //set nose position for dx top
    else if (distance > 28 && nose.x < width / 3 && nose.y < height / 3){
      dxT = true;
      dxC = false;
      dxB = false;
      sxT = false;
      front = false;
      random = false;
      preview = false;
      //draw rect
      fill(37, 37, 37);
      rect(0, 0, 106, 86);
    }
    //set nose position for dx center
    else if (distance > 28 && nose.x < width / 3 && nose.y > height / 3 && nose.y < height / 1.5){
      dxC = true;
      dxT = false;
      dxB = false;
      sxT = false;
      front = false;
      random = false;
      preview = false;
      //draw rect
      fill(37, 37, 37);
      rect(0, 86, 106, 86);
    }
    //set nose position for dx bottom
    else if (distance > 28 && nose.x < width / 3 && nose.y > height / 3){
      dxB = true;
      dxC = false;
      dxT = false;
      sxT = false;
      front = false;
      random = false;
      preview = false;
      //draw rect
      fill(37, 37, 37);
      rect(0, 172, 106, 86);
    }
    //set nose position for front
    else if (distance > 28 && nose.x > width / 3 &&  nose.x < width / 1.5){
      front = true;
      dxT = false;
      dxC = false;
      dxB = false;
      sxT = false;
      sxC = false;
      sxB = false;
      random = false;
      preview = false;
      //draw rect
      fill(37, 37, 37);
      rect(106, 86, 106, 86);
    }
    //set nose position for sx top
    else if (distance > 28 && nose.x > width / 3 && nose.y < height / 3){
      sxT = true;
      dxT = false;
      dxC = false;
      dxB = false;
      sxC = false;
      sxB = false;
      front = false;
      random = false;
      preview = false;
      //draw rect
      fill(37, 37, 37);
      rect(212, 0, 106, 86);
    }
     //set nose position for sx center
     else if (distance > 28 && nose.x > width / 3 && nose.y > height / 3 && nose.y < height / 1.5){
      sxC = true;
      sxT = false;
      dxT = false;
      dxC = false;
      dxB = false;
      sxB = false;
      front = false;
      random = false;
      preview = false;
      //draw rect
      fill(37, 37, 37);
      rect(212, 86, 106, 86);
    }
    //set nose position for sx bottom
    else if (distance > 28 && nose.x > width / 3 && nose.y > height / 3){
      sxB = true;
      sxC = false;
      sxT = false;
      dxT = false;
      dxC = false;
      dxB = false;
      front = false;
      random = false;
      preview = false;
      fill(37, 37, 37);
      rect(212, 172, 106, 86);
    }
    else{
      random = false;
      preview = false;
      dxT = false;
      dxC = false;
      dxB = false;
      sxT = false;
      sxC = false;
      sxB = false;
      sx = false;
      front = false;
    }

    /*
    Here we draw the nose/face and the rest of joint
    The for is a loop. 
    In this case the for loops all the body positions that pose net returns.
    */

    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        if (keypoint.part == "nose") {
          stroke(255, 255, 255);
          line(nose.x, 0, nose.x, height);
          line(0, nose.y, width, nose.y);
        } else {
        }
        noStroke();
      }
    }
  }
}