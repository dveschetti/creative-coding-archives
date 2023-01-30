(function () {

	// vars
	let shuffleButton = document.querySelector("#shuffle");
	let next = document.querySelector("#next");
	let prev = document.querySelector("#prev");
	let list = document.querySelector("#list");
	let filterButton = document.querySelector("#button-slider");
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

	//click open filter button
	filterButton.addEventListener('click', e =>{
		openSlider();

	})

	//click next button
	next.addEventListener("click", () => {
		nextItem();
	});

	//click next button
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

document.addEventListener("keypress", function(event){
	if (event.code == "Space") {
		document.getElementById("shuffle").click();
	}
});

document.addEventListener("dblclick", function() {
    document.getElementById("button-slider").click();
});


document.addEventListener("keypress", function(event){
	if (event.code == "KeyA") {
		document.getElementById("prev").click();
	}
}); 

document.addEventListener("keypress", function(event){
	if (event.code == "KeyD") {
		document.getElementById("next").click();
	}
}); 

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
			node.setAttribute("data-location", response[i].location);
			node.setAttribute("data-colors", response[i].colors);
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");
			child.innerHTML = `<img src='src/img/${response[i].image}' alt='img' /><p class='filetto'>${response[i].title}</p><p>${response[i].location}</p>`;

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
				
				else if (sort == 'location<') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorLocation);
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'location>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorLocation).reverse();
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
	function comparatorLocation(a, b) {
		if (a.dataset.location < b.dataset.location) {
			return -1;
		}
		if (a.dataset.location > b.dataset.location) {
			return 1;
		}
		return 0;
	}



	function openSlider() {
		const slider = document.querySelector('#slider');
		const container = document.querySelector('#container');

		if(!slider.classList.contains("active")){ 
			slider.classList.add("active")
		}
		else { 
			slider.classList.remove("active")
		}
		
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


	



})();