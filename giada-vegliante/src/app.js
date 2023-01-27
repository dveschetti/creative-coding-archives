(function () {

	// vars
	let shuffleButton = document.querySelector("#shuffle");
	let next = document.querySelector("#next");
	let prev = document.querySelector("#prev");
	let list = document.querySelector("#list");
	let search = document.querySelector("#search");
	// let listItems = document.querySelectorAll(".list-item");
	// let numberOfListItems = 8
	let response;

	//insert content
	getRequest('src/json/data.json');

	//click shuffle button
	shuffleButton.addEventListener("click", () => {
		randomItem();
	});

	//click next button
	next.addEventListener("click", () => {
		nextItem();
	});

	//click prev button
	prev.addEventListener("click", () => {
		prevItem();
	});

	//function get json 
	function getRequest(file) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", file);
		xhr.send();
		xhr.onload = function (e) {
			// Check if the request was a success
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				// Get and convert the responseText into JSON
				response = JSON.parse(xhr.responseText);

				//if we have a response then insert content into the list and add event listener to each list item
				insertContent(response);
				setTagsButton();
				setSortButtons();
			}
		}
	}


	function insertContent(response) {
		//delete all
		list.innerHTML = "";

		//loop through list items from json
		for (var i = 0; i < response.length; i++) {
			// create list item
			let node = document.createElement("li");
			node.classList.add("list-item");

			//very import to add the id to the list item and the data attributes
			//without these we can't get the correct item when we filters or order the list
			node.setAttribute("data-tag", response[i].tag);
			node.setAttribute("data-title", response[i].title);
			node.setAttribute("data-year", response[i].year);
			node.setAttribute("data-colors", response[i].colors);
			node.setAttribute("data-time", response[i].time);
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");
			child.innerHTML = `
			<video muted loop autoplay src='src/video/${response[i].video}' onClick="audio(${i})"></video>
			`;

			// <audio class="tracks" id='audio${i}' controls>
			// <source src="src/sound/${[i]}.mp4" type="audio/mpeg"> </audio>
			// src="src/clip/clip${response[i].audio}.mp3
			
			// fade in img
			setTimeout(() => {
				child.classList.add("show");
			}, 100 * i);

			//append child
			node.appendChild(child);

			//append event to list item
			node.addEventListener("click", (e) => {
				selectItem(e.target)
			})

			//append list item to list into DOM
			list.appendChild(node);
		}
	}

		// //audio stop if one starts
	// function selectItem(item) {
	// 	if (!item.classList.contains("active")) {
	// 		item.classList.add("active");
	// 		pauseAllAudio();
	// 		playAudio(item.id);	
	// 	}
	// 	else {
	// 		item.classList.remove("active");
	// 		pauseAllAudio();
	// 	}
	// }

	// function pauseAllAudio() {
	// 	let audios = document.querySelectorAll(".tracks");
	// 	audios.forEach((item) => {
	// 		item.pause();
	// 	})
	// }

	// function playAudio(id) {
	// 	// rectangle = document.querySelector("#rectangle");
	// 	console.log(value);
	// 	let audio = document.querySelector("#audio" + id);
	// 	audio.play();
	// 	if(!isNext) {
	// 		ti = setTimeout(() => {
	// 			nextItem();
	// 		}, value)
	// 	}
	// 	else {
	// 		clearTimeout(ti);
	// 	}
	// }

	function randomItem() {
		for (var i = list.children.length; i >= 0; i--) {
			list.appendChild(list.children[Math.random() * i | 0]);
		}
	}

	function selectItem(item) {
		console.log(item)
		if (!item.classList.contains("active")) {
			console.log("add Active")
			item.classList.add("active");
		}
		else {
			item.classList.remove("active");
		}
	}


	function nextItem() {
		if (timer) {
			var active = document.querySelector('.active');
			if (active) {
				var next = active.nextElementSibling;
				if (next) {
					active.classList.remove('active');
					next.classList.add('active');
				}
				else {
					//get first item list-item into the dom
					active.classList.remove('active');
					active = document.querySelector('.list-item');
					active.classList.add('active');
				}
			}
			timer = false;
		}
	}

	function prevItem() {
		var active = document.querySelector('.active');
		if (active) {
			var prev = active.previousElementSibling;
			if (prev) {
				active.classList.remove('active');
				prev.classList.add('active');
			}
		}
	}

	function setTagsButton() {
		//get all tags from json
		let buttons = document.querySelectorAll('.button-filter');
		//loop through buttons
		buttons.forEach((button) => {
			//attach event to button
			button.addEventListener('click', (e) => {

				//get tag value from button
				let tag = e.target.dataset.tag;

				//show all items
				if (tag == '*') {
					insertContent(response);
				}
				else {
					//insert all content
					insertContent(response);
					//remove all items that don't have the tag
					let items = document.querySelectorAll('.list-item');
					//loop all items
					items.forEach((item) => {
						//check if item has the tag
						if (!item.dataset.tag.includes(tag) && !item.dataset.colors.includes(tag)) {
							list.removeChild(item);
						}
					})
				}

			})
		})
	}


	//set sort button
	function setSortButtons() {
		let buttons = document.querySelectorAll('.button-sort');
		buttons.forEach((button) => {
			//attach event to button sort
			button.addEventListener('click', (e) => {
				let sort = e.target.dataset.sort;

				//sort by title
				if (sort == 'year<') {
					//get all items
					var subjects = document.querySelectorAll('.list-item');
					//convert to array
					var subjectsArray = Array.from(subjects);
					//sort by year
					let sorted = subjectsArray.sort(comparatorYear);
					//insert content
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'year>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorYear).reverse();
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}

				//sort by title
				else if (sort == 'title<') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle);
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'title>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle).reverse();
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}

				//sort by time
				else if (sort == 'time<') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTime);
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'time>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTime).reverse();
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}

				else {

				}

			})
		})
	}

	function comparatorYear(a, b) {
		if (a.dataset.year < b.dataset.year)
			return -1;
		if (a.dataset.year > b.dataset.year)
			return 1;
		return 0;
	}

	function comparatorTitle(a, b) {
		if (a.dataset.title < b.dataset.title) {
			return -1;
		}
		if (a.dataset.title > b.dataset.title) {
			return 1;
		}
		return 0;
	}

	function comparatorTime(a, b) {
		if (a.dataset.time < b.dataset.time) {
			return -1;
		}
		if (a.dataset.time > b.dataset.time) {
			return 1;
		}
		return 0;
	}

	//on key press search
	let timeout = null;
	search.addEventListener('keyup', (e) => {
		// wait 1000ms after user stops typing
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			//insert all content
			insertContent(response);
			//get search value
			let search = e.target.value.toLowerCase();
			//get all items
			let items = document.querySelectorAll('.list-item');
			items.forEach((item) => {
				//if item doesn't have the search value remove it
				if (!item.dataset.title.toLowerCase().includes(search.toLowerCase())) {
					list.removeChild(item);
				}
			})
		}, 1000);
	})

	//speed of netxt image
	let timer = false;
	setInterval(() => {
		if (timer) {
			timer = false;
		}
		else {
			timer = true;
		}
	}, 10);

	
	let setShuffle = false;
	let setNext = false;
	let setPrev = false;
	//let's wait at least a second before starting the loop

	//Teachable machine
	setTimeout(() => {
		function drawLoop() {
			//if p5 is ready
			if (ready) {
				//if p5.js sent the shuffle message
				if (label == "shuffle" && confidence > 0.95) {
					if (!setShuffle) {
						setShuffle = true;
						setNext  = false;
						setPrev = false;

						randomItem();
					}
				}

				else if (label == 'next' && confidence > 0.95) {
					if (!setNext) {
						setShuffle = false;
						setNext  = true;
						setPrev = false;

						nextItem();
					}
					}

					else if (label == 'prev' && confidence > 0.95) {
						if (!setPrev) {
						setShuffle = false;
						setNext  = false;
						setPrev = true;

						prevItem();
					}
					}

					else if (label == "tag" && confidence > 0.95) {
						document.getElementById("tag").style.display = "block"
						document.getElementById("sort").style.display = "block"
						document.getElementById("search").style.display = "block"
					}
							
				else {
					document.getElementById("tag").style.display = "none"
					document.getElementById("sort").style.display = "none"
					document.getElementById("search").style.display = "none"
					setShuffle = false;
					setNext  = false;
					setPrev = false;
				}
			}
			requestAnimationFrame(drawLoop);
		}
		requestAnimationFrame(drawLoop);
	}, 1000);


})();


//select an attribute via button and change the background
const src = document.getElementsByClassName("buttons");
const b1 = document.querySelector("#v1")
b1.addEventListener("click", function(e) {
b1.style.backgroundColor="rgb(255, 0, 204)";
// b1.style.color="black";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b2 = document.querySelector("#v2")
b2.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.backgroundColor="rgb(255, 0, 204)";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b3 = document.querySelector("#v3")
b3.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.backgroundColor="rgb(255, 0, 204)";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b4 = document.querySelector("#v4")
b4.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.backgroundColor="rgb(255, 0, 204)";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b5 = document.querySelector("#v5")
b5.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.backgroundColor="rgb(255, 0, 204)";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b6 = document.querySelector("#v6")
b6.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.backgroundColor="rgb(255, 0, 204)";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b7 = document.querySelector("#v7")
b7.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.backgroundColor="rgb(255, 0, 204)";
b8.style.background="none";
b9.style.background="none";
b10.style.background="none";
})

const b8 = document.querySelector("#v8")
b8.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.backgroundColor="rgb(255, 0, 204)";
b9.style.background="none";
b10.style.background="none";
})

const b9 = document.querySelector("#v9")
b9.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.backgroundColor="rgb(255, 0, 204)";
b10.style.background="none";
})

const b10 = document.querySelector("#v10")
b10.addEventListener("click", function(e) {
b1.style.background="none";
b2.style.background="none";
b3.style.background="none";
b4.style.background="none";
b5.style.background="none";
b6.style.background="none";
b7.style.background="none";
b8.style.background="none";
b9.style.background="none";
b10.style.backgroundColor="rgb(255, 0, 204)";
})