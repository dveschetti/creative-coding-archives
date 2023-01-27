(function () {
	
	// vars
	let shuffleButton = document.querySelector("#shuffle");
	let list = document.querySelector("#list");
	let search = document.querySelector("#search");
	let listItems = document.querySelectorAll(".list-item");
	let numberOfListItems = 8
	let response;

	//insert content
	getRequest('src/json/data.json');

	//click shuffle button
	shuffleButton.addEventListener("click", () => {
		randomItem();
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
			node.setAttribute("data-place", response[i].place);
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");
			//show only first 4 digits of the year
			let year = response[i].year;
			let yearDigits = year.substring(0, 4);
			child.innerHTML = `<img src='src/img/${response[i].image}' alt='img' /><p>${response[i].title}</p><p>${yearDigits}</p><p>${response[i].tag}</p><p>${response[i].place}</p>`;

			// fade in img
			setTimeout(() => {
				child.classList.add("show");
			}, 1 * i);

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

	//function for shuffle button
	function randomItem() {
		for (var i = list.children.length; i >= 0; i--) {
			list.appendChild(list.children[Math.random() * i | 0]);
		}
	}

	//keypress shuffle
	document.addEventListener("keypress", function(event) {
		if (event.key === "g") {
		  document.getElementById("shuffle").click();
		}
	});

	//make the img follow the cursor position > only x axis
	document.addEventListener("mousemove", function(event) {
		var x = event.clientX;
		var img = document.querySelector('.item.show:hover>img');
		if(img){
			img.style.left = x + 'px';
		}
	});

	//function for hover of the img
	let previousActive;

	function selectItem(item) {
    item.addEventListener("mouseenter", function(){
        if(previousActive){
            previousActive.classList.remove("hover");
        }
        item.classList.add("hover");
        previousActive = item;
    });
	}

	//function filters
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
						if (!item.dataset.tag.includes(tag) && !item.dataset.place.includes(tag)) {
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
				else if (sort == 'place<') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle);
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'place>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle).reverse();
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
		if (a.dataset.place < b.dataset.place) {
			return -1;
		}
		if (a.dataset.place > b.dataset.place) {
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


})();