const sketch1 = new p5((p) => {
  let data; // variable to store the data from the JSON file
  let currentYearRange = []; // array to store the currently selected range of years
  let startX, endX; // variables to store the x positions of the draggable lines
  let prevStartX, prevEndX; // variables to store the previous positions of the lines
  let draggingStart = false; // variable to store whether the start line is being dragged
  let draggingEnd = false; // variable to store whether the end line is being dragged
  let easing = 0.1; // amount of interpolation to apply to the line positions
  let maxCount = 10;
  let maxYear = 2017;
  let minYear = 1937;
  let counts;
  let removedImages = [];
  let works = document.getElementById("ElmCnt")

  p.preload = function () {
    // load the JSON file
    data = p.loadJSON('src/data.json');
  }

  p.setup = function () {
    var myCanvas = p.createCanvas(p.windowWidth/3, 71);
    myCanvas.parent("MyCanvas")
    if (p.windowWidth <= 960) {
      p.resizeCanvas((p.windowWidth - 30), 71);
    }
    // if (p.windowWidth <= 1920) {
    //   p.resizeCanvas((p.windowWidth / 3.5), 71);
    // }
    // convert the position of the start and end lines based on the new width of the canvas
    startX = p.map(startX / p.width, 0, 1, 0, p.width);
    endX = p.map(endX / p.width, 0, 1, 0, p.width);
    // create an object to store the counts for each year
    counts = {};

    // loop through the data and count the number of images for each year
    for (let i = 0; i < data.images.length; i++) {
      let year = data.images[i].year;
      if (counts[year] === undefined) {
        counts[year] = 1;
      } else {
        counts[year]++;
      }
      p.DOMCountUpdate();
    }

    // set the initial positions of the draggable lines
    startX = 20;
    endX = p.width - 20;
    prevStartX = startX;
    prevEndX = endX;
  }

  p.draw = function () {
    // draw the lines of the timeline
    p.background(36, 36, 36)
    p.strokeWeight(2);
    p.stroke(200);
    for (let year in counts) {
      let count = counts[year];

      // calculate the x and y positions of the line
      let x = p.map(year, minYear, maxYear, 20, p.width - 20);
      let y = p.map(count, 0, maxCount, p.height - 20, 0);

      // draw the line
      if (x < startX || x > endX) {
        // set the stroke color and alpha value for the lines that are not included in the range
        p.stroke(200, 90);
        p.line(x, y, x, p.height - 20);
      } else {
        // set the stroke color and alpha value for the lines that are included in the range
        p.stroke(200);
        p.line(x, y, x, p.height - 20);
      }

    }


    // draw the draggable lines
    let startYear = Math.round(p.map(startX, 0, p.width, minYear, maxYear));
    let endYear = Math.round(p.map(endX, 0, p.width, minYear, maxYear));
    p.push()
    p.fill(255)
    p.noStroke()
    p.text(startYear, startX - 15, p.height - 15, 20);
    p.text(endYear, endX - 15, p.height - 15, 20);
    p.pop()
    p.strokeWeight(2);
    p.stroke(255, 138, 0);
    p.line(startX, p.height * 0.3, startX, p.height - 20);
    p.line(endX, p.height * 0.3, endX, p.height - 20);
    p.push()
    p.noStroke()
    p.fill(255, 138, 0)
    p.rect(startX - 5, p.height * 0.25, 10, 10)
    p.rect(endX - 5, p.height * 0.25, 10, 10)
    p.pop()

    // interpolate the positions of the lines
    startX = p.lerp(startX, prevStartX, 1 - easing);
    endX = p.lerp(endX, prevEndX, 1 - easing);
  }

  p.DOMCountUpdate = function () {
    works.innerHTML = data.images.length+data.canzoni.length
  }
  p.mousePressed = function () {
    // check if the mouse is over the start or end line
    if (p.abs(p.mouseX - startX) < 10) {
      draggingStart = true;
    } else if (p.abs(p.mouseX - endX) < 10) {
      draggingEnd = true;
    }
  }
  p.touchStarted = function () {
    for (var i = 0; i < p.touches.length; i++) {
      var touch = p.touches[i];
      if (p.abs(touch.x - startX) < 10) {
        draggingStart = true;
      } else if (p.abs(touch.x - endX) < 10) {
        draggingEnd = true;
      }
    }
  }

  p.mouseDragged = function () {
    if (draggingStart) {
      prevStartX = p.constrain(p.mouseX, 15, endX - 10);
    } else if (draggingEnd) {
      prevEndX = p.constrain(p.mouseX, startX + 15, p.width - 15);
    }

  }
  p.touchMoved = function () {
    for (var i = 0; i < p.touches.length; i++) {
      var touch = p.touches[i];
      if (draggingStart) {
        prevStartX = p.constrain(touch.x, 15, endX - 10);
      } else if (draggingEnd) {
        prevEndX = p.constrain(touch.x, startX + 15, p.width - 15);
      }
    }
  }


  p.mouseReleased = function () {
    // reset the dragging flags and update the timeline
    draggingStart = false;
    draggingEnd = false;

    // only update the timeline if the positions of the lines have changed
    if (startX !== prevStartX || endX !== prevEndX) {
      p.updateTimeline();
    }
  }
  p.touchEnded = function () {
    // reset the dragging flags and update the timeline
    draggingStart = false;
    draggingEnd = false;

    // only update the timeline if the positions of the lines have changed
    if (startX !== prevStartX || endX !== prevEndX) {
      p.updateTimeline();
    }
  }

  p.updateTimeline = function () {
    // clear the canvas
    p.clear();
    // create an object to store the counts for each year
    let counts = {};
    // loop through the data and count the number of images for each year
    for (let i = 0; i < data.images.length; i++) {
      let year = data.images[i].year;
      if (counts[year] === undefined) {
        counts[year] = 1;
      } else {
        counts[year]++;
      }
    }
    // interpolate the positions of the lines
    startX = p.lerp(startX, prevStartX, 1 - easing);
    endX = p.lerp(endX, prevEndX, 1 - easing);

    // update the current year range
    currentYearRange[0] = p.map(startX, 0, p.width, minYear, maxYear);
    currentYearRange[1] = p.map(endX, 0, p.width, minYear, maxYear);

    // update the data based on the current year range
    p.updateData();
  }

  //Filtra le immagini selezionate
  p.updateData = function (listItems) {
    // update the listItems variable
    listItems = document.querySelectorAll(".list-item");
    // loop through the list items
    for (let i = 0; i < listItems.length; i++) {
      // get the year of the current list item
      let year = listItems[i].getAttribute("data-year");
      // check if the year is within the selected range
      if (year >= currentYearRange[0] && year <= currentYearRange[1]) {
        // if it is, show the list item
        listItems[i].classList.remove("hidden");
      } else {
        // if it is not, hide the list item
        listItems[i].classList.add("hidden");
      }
    }
  }
});

// //2 SKETCH
// const sketch2 = new p5((p) => {
//   let data; // variable to store the data from the JSON file
//   let subjects; // object to store the counts for each subject
//   let maxCount; // variable to store the maximum count for a subject
//   let selectedSubject = null;

//   // load the JSON file
//   p.preload = function () {
//     data = p.loadJSON('src/data.json');
//   }

//   p.setup = function () {
//     var myCanvas = p.createCanvas(501, 52);
//     myCanvas.parent("MyCanvasB")
//     if (p.windowWidth <= 960) {
//       p.resizeCanvas((p.windowWidth - 80), 71);
//     }

//     // create an object to store the counts for each subject
//     subjects = {};

//     // loop through the data and count the number of images for each subject
//     for (let i = 0; i < data.images.length; i++) {
//       let subject = data.images[i].subject;
//       if (subjects[subject] === undefined) {
//         subjects[subject] = 1;
//       } else {
//         subjects[subject]++;
//       }
//     }

//     // find the maximum count for a subject
//     maxCount = 0;
//     for (let subject in subjects) {
//       let count = subjects[subject];
//       if (count > maxCount) {
//         maxCount = count;
//       }
//     }
//   }

//   p.draw = function () {

//     p.noStroke();
//     let margin = 10
//     let spacing = 7;
//     let i = 0;
//     for (let subject in subjects) {
//       let count = subjects[subject];
//       let x = (p.width / 2) * (i % 2) + spacing * (i % 2);
//       let y = (p.height / 2) * Math.floor(i / 2) + spacing * Math.floor(i / 2);
//       let w = p.map(count, 0, maxCount, 0, p.height);
//       let h = 21;
//       //bgRect
//       p.fill(144, 144, 144);
//       p.rect(x, y, p.width / 2, h);
//       //fwRect
//       p.fill(255, 138, 0);
//       p.rect(x, y, w, h);
//       // draw the subject name on top of the rectangle
//       p.fill(255);
//       p.textSize(11);
//       p.textAlign(p.LEFT, p.CENTER);
//       p.text(subject, x + 10, y + h / 2);

//       // draw the count on the right of the rectangle
//       p.fill(255);
//       p.textSize(11);
//       p.textAlign(p.RIGHT, p.CENTER);

//       if (p.windowWidth <= 960) {
//         p.textAlign(p.RIGHT, p.CENTER);
//       }
//       p.text(count + ' Elements', x + margin * 15, y + h / 2);
//       i++;

//       //filtro e cambio opacità
//       if (p.mouseX > x && p.mouseX < x + w && p.mouseY > y && p.mouseY < y + h) {
//         if (p.mouseIsPressed) {
//           filterElements(subject);
//         }
//       }
//     }
//   }
// });
// // variabile globale per memorizzare il soggetto selezionato
// let selectedRect = "";
// function filterElements(subject) {
//   let listItems = document.querySelectorAll('.list-item');

//   // se si clicca nuovamente sul rettangolo attivo, rimuovi il filtro
//   if (subject === selectedRect) {
//     selectedRect = '';
//     listItems.forEach(function (item) {
//       item.classList.remove("filterHide");
//       console.log(selectedRect)
//     });
//   } else {
//     selectedRect = subject;
//     // nascondi tutti gli elementi all'inizio
//     listItems.forEach(function (item) {
//       item.classList.add("filterHide");
//     });

//     // mostra solo gli elementi con il soggetto desiderato
//     listItems.forEach(function (item) {
//       if (item.getAttribute("data-subject") === subject) {
//         item.classList.remove("filterHide");
//       }
//     });
//   }
// }


