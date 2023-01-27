(function () {

	// vars
	let shuffleButton = document.querySelector("#shuffle");
	let next = document.querySelector("#next");
	let prev = document.querySelector("#prev");
	let list = document.querySelector("#list");
	let search = document.querySelector("#search");
	let listItems = document.querySelectorAll(".list-item");
	let numberOfListItems = 8
	let response;
	let setNext = false;
	let setPrev = false;

	//insert content
	getRequest('src/json/data.json');


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
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");
			child.innerHTML = `<img src='src/img/${response[i].image}' alt='img' />`;

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

	function randomItem() {
		for (var i = list.children.length; i >= 0; i--) {
			list.appendChild(list.children[Math.random() * i | 0]);
		}
	}

	function selectItem(item) {
		//console.log(item)
		if (!item.classList.contains("active")) {
			console.log("add Active")
			item.classList.add("active");
		}
		else {
			item.classList.remove("active");
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

				//sort by colors
				if (sort == 'colors<') {
					//get all items
					var subjects = document.querySelectorAll('.list-item');
					//convert to array
					var subjectsArray = Array.from(subjects);
					//sort by year
					let sorted = subjectsArray.sort(comparatorColors);
					//insert content
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}

			})
		})
	}

	function comparatorColors(a, b) {
		if (a.dataset.colors < b.dataset.colors)
			return -1;
		if (a.dataset.colors > b.dataset.colors)
			return 1;
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

	//speed of next image
	let timer = false;
	setInterval(() => {

		// NEXT ITEM ——————————
		if (nextImage == true && zoom == true) {
			if (!setNext){
				console.log("next")
				nextItem();
				nextImage=false;
			}
			setNext = true;
		}	
		else {
			setNext = false;
		}

		// PREV ITEM ——————————
		if(prevImage == true && zoom == true) {
			if (!setPrev) {
				console.log("indietro");
				prevItem();
				prevImage=false;
			}
			setPrev = true;
		}
		else {
			setPrev = false;
		}

		// SORT ——————————————————
		if (orderColor1 == true) {
			//console.log("ciao")
				//get all items
				var subjects = document.querySelectorAll('.list-item');
				//convert to array
				var subjectsArray = Array.from(subjects);
				//sort by year
				let sorted = subjectsArray.sort(comparatorColors);
				//insert content
				sorted.forEach(e => document.querySelector("#list").appendChild(e));
				orderColor1 = false;
			}
		if (timer) {
			timer = false;
		}
		else {
			timer = true;
		}
		

	}, 5);

	// ———— NEXT PREV FUNCTIONS
	function nextItem() {
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

	function prevItem() {
		console.log("indietro")
		var active = document.querySelector('.active');
		if (active) {
			var prev = active.previousElementSibling;
			if (prev) {
				active.classList.remove('active');
				prev.classList.add('active');
			}
		}
	}

	let setShuffle = false;
	//let's wait at least a second before starting the loop
	setTimeout(() => {
		function drawLoop() {
			//if p5 is ready
			if (ready) {
				let init = false;
				let active = document.querySelector('.active');
				// SHUFFLE ———————————
				if (shuffle == true) {
					if (!setShuffle) {
						randomItem();
						setShuffle = false;
					}
				}
				else  {
					setShuffle = false;
					shuffle = false;
					
				}
				// ZOOM ————————————
				if (zoom == true ) {
					let item = document.querySelectorAll('.list-item')[0];
					let active = document.querySelectorAll('.active');

				if (active.length == 0) {
					selectItem(item)
				}
				}
				if (zoom == false) {
					document.querySelectorAll('li').forEach((item) => {
						item.classList.remove('active')
				})
				}
			
				
			}
			requestAnimationFrame(drawLoop);
		}
		requestAnimationFrame(drawLoop);
	}, 500);



})();