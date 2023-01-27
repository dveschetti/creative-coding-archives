(function () {

	// vars
	let list = document.querySelector("#list");
	let search = document.querySelector("#search");
	let response;

	// insert content
	getRequest('src/json/data.json');

	// function get json 
	function getRequest(file) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", file);
		xhr.send();
		xhr.onload = function (e) {
			// Check if the request was a success
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				// Get and convert the responseText into JSON
				response = JSON.parse(xhr.responseText);

				// if we have a response then insert content into the list and add event listener to each list item
				insertContent(response);
				setTagsButton();
				setSortButtons();
			}
		}
	}

	function insertContent(response) {
		// delete all
		list.innerHTML = "";

		// loop through list items from json
		for (var i = 0; i < response.length; i++) {
			// create list item
			let node = document.createElement("li");
			node.classList.add("list-item");

			// very import to add the id to the list item and the data attributes
			// without these we can't get the correct item when we filters or order the list
			node.setAttribute("data-title", response[i].title);
			node.setAttribute("data-tag", response[i].tag);
			node.setAttribute("data-colors", response[i].colors);
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");
			child.innerHTML = `<img src='src/img/${response[i].image}'
			alt='img'
			/>`;

			// fade in img
			setTimeout(() => {
				child.classList.add("show");
			}, 100 * i);

			// append child
			node.appendChild(child);

			// append event to list item
			node.addEventListener("click", (e) => {
				selectItem(e.target)
			})

			// append list item to list into DOM
			list.appendChild(node);
		}
	}

	// shuffle items randomly
	function randomItem() {
		for (var i = list.children.length; i >= 0; i--) {
			list.appendChild(list.children[Math.random() * i | 0]);
		}
	}

	// enter in the preview
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

	function setTagsButton() {
		// get all tags from json
		let buttons = document.querySelectorAll('.button-filter');
		// loop through buttons
		buttons.forEach((button) => {
			// attach event to button
			button.addEventListener('click', (e) => {

				// get tag value from button
				let tag = e.target.dataset.tag;

				// show all items
				if (tag == 'all') {
					insertContent(response);
				}
				else {
					// insert all content
					insertContent(response);
					// remove all items that don't have the tag
					let items = document.querySelectorAll('.list-item');
					// loop all items
					items.forEach((item) => {
						// check if item has the tag
						if (!item.dataset.tag.includes(tag) && !item.dataset.colors.includes(tag)) {
							list.removeChild(item);
						}
					})
				}

			})
		})
	}

	// set sort button
	function setSortButtons() {
		let buttons = document.querySelectorAll('.button-sort');
		buttons.forEach((button) => {
			// attach event to button sort
			button.addEventListener('click', (e) => {
				let sort = e.target.dataset.sort;

				// sort by colors
				if (sort == 'colors<') {
					// get all items
					var subjects = document.querySelectorAll('.list-item');
					// convert to array
					var subjectsArray = Array.from(subjects);
					// sort by color
					let sorted = subjectsArray.sort(comparatorColors);
					// insert content
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}

				// sort by title
				else if (sort == 'title<') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle);
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
			})
		})
	}

	// sort by title
	function comparatorTitle(a, b) {
		if (a.dataset.title < b.dataset.title) {
			return -1;
		}
		if (a.dataset.title > b.dataset.title) {
			return 1;
		}
		return 0;
	}

	// sort by color
	function comparatorColors(a, b) {
		if (a.dataset.colors < b.dataset.colors) {
			return -1;
		}
		if (a.dataset.colors > b.dataset.colors) {
			return 1;
		}
		return 0;
	}

	// on key press search
	let timeout = null;
	search.addEventListener('keyup', (e) => {
		// wait 1000ms after user stops typing
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			// insert all content
			insertContent(response);
			// get search value
			let search = e.target.value.toLowerCase();
			// get all items
			let items = document.querySelectorAll('.list-item');
			items.forEach((item) => {
				// if item doesn't have the search value remove it
				if (!item.dataset.title.toLowerCase().includes(search.toLowerCase())) {
					list.removeChild(item);
				}
			})
		}, 1000);
	})

	// speed of next image
	let timer = false;
	setInterval(() => {
		if (timer) {
			timer = false;
		}
		else {
			timer = true;
		}
	}, 10);

	// activate interactions by teachable machine
	let setShuffle = false;
	let setNext = false;
	let setPreview = false;
	let setPrevious = false;
	let setFilters = false;
	let setSearch = false;
	let setSortName = false;
	let setSortColor = false;

	// let's wait at least a second before starting the loop
	setTimeout(() => {
		function drawLoop() {
			// if p5 is ready
			if (ready) {
				let init = false;
				let active = document.querySelector('.active');
				// sent the message "shuffle"
				if (label == "Shuffle" && confidence > 0.9) {
					if (!setShuffle) {
						randomItem();
						audio = createAudio('src/audio/shuffle.mp3');
						audio.autoplay(true);
					}
					setShuffle = true;
				}
				// sent the message "sort by name"
				else if (label == "Sort by name" && confidence > 0.9) {
					if (!setSortName) {
						var subjects = document.querySelectorAll('.list-item');
						var subjectsArray = Array.from(subjects);
						let sorted = subjectsArray.sort(comparatorTitle);
						sorted.forEach(e => document.querySelector("#list").appendChild(e));
						audio = createAudio('src/audio/sort.mp3');
						audio.autoplay(true);
					}
					setSortName = true;
				}
				// sent the message "sort by color"
				else if (label == "Sort by color" && confidence > 0.9) {
					if (!setSortColor) {
						var subjects = document.querySelectorAll('.list-item');
						var subjectsArray = Array.from(subjects);
						let sorted = subjectsArray.sort(comparatorColors);
						sorted.forEach(e => document.querySelector("#list").appendChild(e));
						audio = createAudio('src/audio/sort.mp3');
						audio.autoplay(true);
					}
					setSortColor = true
				}
				// sent the message "select"
				else if (label == "Select" && confidence > 0.5) {
					let itemUno = document.querySelectorAll('.list-item')[0];
					if (!active) {
						init = true;
						selectItem(itemUno);
						audio = createAudio('src/audio/select.mp3');
						audio.autoplay(true);
					}
				}
				// sent the message "preview"
				else if (label == "Preview" && confidence > 0.9) {
					if (!setPreview) {
						init = false;
							active.classList.remove('active');
							audio = createAudio('src/audio/sort.mp3');
							audio.autoplay(true);
					}
					setPreview = true;
				}
				// sent the message "next"
				else if (label == "Next" && confidence > 0.9) {
					if (!setNext) {
							var next = active.nextElementSibling;
							if (next) {
								active.classList.remove('active');
								next.classList.add('active');
								audio = createAudio('src/audio/next.mp3');
								audio.autoplay(true);
						}
					}
					setNext = true;
				}
				// sent the message "previous"
				else if (label == "Previous" && confidence > 0.9) {
					if (!setPrevious) {
							var prev = active.previousElementSibling;
							if (prev) {
								active.classList.remove('active');
								prev.classList.add('active');
								audio = createAudio('src/audio/next.mp3');
								audio.autoplay(true);
						}
					}
					setPrevious = true;
				}
				// sent the message "search"
				else if (label == "Search" && confidence > 0.9) {
					if (!setSearch) {
						document.getElementById("search").style.display = "block"
						audio = createAudio('src/audio/search.mp3');
						audio.autoplay(true);
					}
					setSearch = true;
				}
				// sent the message "filters"
				else if (label == "Filters" && confidence > 0.9) {
					if (!setFilters) {
						document.getElementById("filters").style.display = "block"
						audio = createAudio('src/audio/search.mp3');
						audio.autoplay(true);
					}
					setFilters = true;
				}
				else {
					document.getElementById("search").style.display = "none"
					document.getElementById("filters").style.display = "none"
					setShuffle = false;
					setNext = false;
					setPrevious = false;
					setPreview = false;
					setFilters = false;
					setSearch = false;
					setSortColor = false;
					setSortName = false;
				}
			}
			requestAnimationFrame(drawLoop);
		}
		requestAnimationFrame(drawLoop);
	}, 1000);


})();