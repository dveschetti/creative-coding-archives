(function () {

	// vars
	let shuffleButton = document.querySelector("#shuffle");
	let next = document.querySelector("#next");
	let prev = document.querySelector("#prev");
	let list = document.querySelector("#list");
	let search = document.querySelector("#search");
	let listItems = document.querySelectorAll(".list-item");
	let numberOfListItems = 200
	let response;
	let mX = 0;

	let jsonData;


	//insert content
	getRequest('src/json/data.json');


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
				console.log(response);

				//if we have a response then insert content into the list and add event listener to each list item
				insertContent(response);
				setTagsButton(response);
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
			node.setAttribute("data-title", response[i].title);
			node.setAttribute("data-month", response[i].month);
			node.setAttribute("data-date", response[i].date);
			node.setAttribute("data-tag", response[i].tag);
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");
			child.innerHTML = `<img src='src/img/${response[i].image}' alt='img' /><p>${response[i].date}</p></p>`;

			// fade in img
			setTimeout(() => {
				child.classList.add("show");
			}, 15 * i);

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

	//shuffle
	function randomItem() {
		for (var i = list.children.length; i >= 0; i--) {
			list.appendChild(list.children[Math.random() * i | 0]);
		}
	}

	function selectItem(item) {
		console.log(item)
		sound.play();
		if (!item.classList.contains("active")) {
			console.log("add Active");
			item.classList.add("active");
		}
		else {
			item.classList.remove("active");
		}
	}

	//tag direction
	function setTagsButton(response) {
		
		let items = document.querySelectorAll('.list-item');
		//if nose is positioned on dx and top
		
		if (dxT == true) {
			for(let index in response){
				//find imgs with tag different than dxT
				if (response[index].tag == 'sxT' || response[index].tag == 'sxC' || response[index].tag == 'sxB' || response[index].tag == 'front' || response[index].tag == 'dxC' || response[index].tag == 'dxB'){
					let item = items[index];
					item.classList.remove("hide");
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag dxT
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}	
				}
			}
		}

		//if nose is positioned on dx and center
		if (dxC == true) {
			for(let index in response){
				//find imgs with tag different than dxC
				if (response[index].tag == 'sxT' || response[index].tag == 'sxC' || response[index].tag == 'sxB' || response[index].tag == 'front' || response[index].tag == 'dxT' || response[index].tag == 'dxB'){
					let item = items[index];
					item.classList.remove("hide");
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag dxC
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}	
				}
			}
		}

		//if nose is positioned on dx and bottom
		if (dxB == true) {
			for(let index in response){
				//find imgs with tag different than dxB
				if (response[index].tag == 'sxT' || response[index].tag == 'sxC' || response[index].tag == 'sxB' || response[index].tag == 'front' || response[index].tag == 'dxT' || response[index].tag == 'dxC'){
					let item = items[index];
					item.classList.remove("hide");
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag dxB
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}	
				}
			}
		}

		//if nose is positioned on center
		else if (front == true) {
			for(let index in response){
				//find imgs with tag different than front
				if (response[index].tag == 'sxT' || response[index].tag == 'sxC' || response[index].tag == 'sxB' || response[index].tag == 'dxT'|| response[index].tag == 'dxC' || response[index].tag == 'dxB'){
					let item = items[index];
					item.classList.remove("hide");
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag front
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}
				}
			}
		}
		//if nose is positioned on sx and top
		else if (sxT == true) {
			for(let index in response){
				//find imgs with tag different than sxT
				if (response[index].tag == 'sxC' || response[index].tag == 'sxB' || response[index].tag == 'front' || response[index].tag == 'dxT'|| response[index].tag == 'dxC' || response[index].tag == 'dxB'){
					let item = items[index];
					item.classList.remove("hide");
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag sxT
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}
					
				
				}
			}
		}
		
		//if nose is positioned on sx and center
		else if (sxC == true) {
			for(let index in response){
				//find imgs with tag different than sxC
				if (response[index].tag == 'sxT' || response[index].tag == 'sxB' || response[index].tag == 'front' || response[index].tag == 'dxT'|| response[index].tag == 'dxC' || response[index].tag == 'dxB'){
					let item = items[index];
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag sxC
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}
				}
			}
		}
		//if nose is positioned on sx and bottom
		else if (sxB == true) {
			for(let index in response){
				//find imgs with tag different than sxB
				if (response[index].tag == 'sxT' || response[index].tag == 'sxC' || response[index].tag == 'front' || response[index].tag == 'dxT'|| response[index].tag == 'dxC' || response[index].tag == 'dxB'){
					let item = items[index];
					if(item === undefined){ 
					
					}
					//remove items that don't have the tag sxB
					else {
						if(items[index].dataset.tag.includes(response[index].tag)){
							item.classList.add("hide");
							//list.removeChild(items[index]);
						}
					}
					
				
				}
			}
		}
	}

	function comparatorDate(a, b) {
		if (a.dataset.date < b.dataset.date)
			return -1;
		if (a.dataset.date > b.dataset.date)
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
		if (timer) {
			timer = false;
		}
		else {
			timer = true;
		}
	}, 500);

	//next image
	function nextItem() {
		if (timer) {
			var active = document.querySelector('.active');
			if (active) {
				//active next frame
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

	//previous image
	function prevItem() {
		if(timer){
			var active = document.querySelector('.active');
			if (active) {
				var prev = active.previousElementSibling;
				if (prev) {
					active.classList.remove('active');
					prev.classList.add('active');
				}
			}
			timer = false;
		}
		
	}

	// variables for shuffle
	let oldX = window.screenX;
	let oldY = window.screenY;
	let setShuffle = false;

	//stop the preview loop
	previewDone = false;
	//loop
	//let's wait at least a second before starting the loop
	setTimeout(() => {	
		function drawLoop() {
			
			//if p5 is ready
			if (ready) {

				//if move window shuffle order
				var interval = setInterval(function () {
		
					// if the coordinates of the window change, do the shuffle
					if (oldX != window.screenX || oldY != window.screenY) {
						if (!setShuffle) {
							randomItem();
							setShuffle = true;
						}	
						else if (oldX == 0 && oldY == 25){
							setShuffle = false;
							var subjects = document.querySelectorAll('.list-item');
							//convert to array
							var subjectsArray = Array.from(subjects);
							//sort by year
							let sorted = subjectsArray.sort(comparatorDate);
							//insert content
							sorted.forEach(e => document.querySelector("#list").appendChild(e));
						}
						} else {
							setShuffle = false;
						}
					oldX = window.screenX;
					oldY = window.screenY;
				}, 1000);

				var active = document.querySelector('.active')
				
				//if previwe form p5.js is active (based on distance) insert all images
				if (preview == true) {
					if (!previewDone) {
					insertContent(response);
					console.log(distance);
					//set true once is done to stop the loop
					previewDone = true;
					}
				}

				//if nose is positioned on right and top
				else if (dxT == true) {
					//show imgs with dxT tag
					setTagsButton(response);
					//once the direction as been shown the preview is set back to false, and then can be activated again
					previewDone = false;
				}
				//if nose is positioned on right and center
				else if (dxC == true) {
					setTagsButton(response);
					previewDone = false;
				}
				//if nose is positioned on right and bottom
				else if (dxB == true) {
					setTagsButton(response);
					previewDone = false;
				}
				//if nose is positioned on left and top
				else if (sxT == true) {
					setTagsButton(response);
					previewDone = false;
				}
				//if nose is positioned on left and center
				else if (sxC == true) {
					setTagsButton(response);
					previewDone = false;
				}
				//if nose is positioned on left and bottom
				else if (sxB == true) {
					setTagsButton(response);
					previewDone = false;
				}
				//if nose is positioned on center
				else if (front == true) {
					setTagsButton(response);
					previewDone = false;
				}

				else { 
				}
				
				//next and prev
				if(keyIsPressed){
					//if press right arrow show next image
					if (keyCode == RIGHT_ARROW){
						nextItem();
						sound.play();
					}
					//if press left arrow show previous image
					else if (keyCode == LEFT_ARROW){
						prevItem();
						sound.play();
					}
					else if (keyCode == CONTROL){
						//get all items
						var subjects = document.querySelectorAll('.list-item');
						//convert to array
						var subjectsArray = Array.from(subjects);
						//sort by year
						let sorted = subjectsArray.sort(comparatorDate);
						//insert content
						sorted.forEach(e => document.querySelector("#list").appendChild(e));
					}
					else if (keyCode == OPTION){
						var subjects = document.querySelectorAll('.list-item');
						var subjectsArray = Array.from(subjects);
						let sorted = subjectsArray.sort(comparatorDate).reverse();
						sorted.forEach(e => document.querySelector("#list").appendChild(e));
					}
					else{
						sound.pause();
					}
				}
			}
			requestAnimationFrame(drawLoop);
		}
		requestAnimationFrame(drawLoop);
	}, 1000);
}) ();

