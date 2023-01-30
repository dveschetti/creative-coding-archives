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

    //insert content
    getRequest('src/data.json');


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
                // setTagsButton();
                setSortButtons();
                setRectanglesFilter();
                setRectanglesCount()
                // randomItem()
            }
        }
    }


    // Add the tag to each rectangle


    function insertContent(response) {
        // elimina tutti gli elementi della lista
        list.innerHTML = "";

        // ciclo attraverso gli elementi immagine del JSON
        for (var i = 0; i < response.images.length; i++) {
            let currentImage = response.images[i];
            // Recupera il nome dell'immagine senza estensione
            let imageName = currentImage.image.split(".")[0];
            // Recupera l'ultimo carattere del nome dell'immagine
            let lastChar = imageName.slice(-1);

            //nomi immagini
            //     let p = document.createElement("p")
            //     p.classList.add("imagesName")
            //     if(currentImage.image.split(".")[0].length < 20){
            //     p.innerHTML = `<p>${currentImage.image.split(".")[0]}<p/>`
            // } else {
            //     p.innerHTML = `<p>${currentImage.image.split(".")[0].slice(0,20)+'..'}<p/>`
            //     console.log(currentImage.image.split(".")[0].slice(0,5))
            // }
            // Controlla se l'ultimo carattere del nome dell'immagine è un numero
            if (!isNaN(lastChar)) {
                // Crea un elemento <li>
                let node = document.createElement("li");
                node.classList.add("list-item");
                node.setAttribute("data-year", currentImage.year);
                node.setAttribute("data-subject", currentImage.subject);
                node.id = i;

                // Crea un elemento <div> per contenere l'immagine
                let child = document.createElement("div");
                child.classList.add("item");
                child.innerHTML = `<img src='Scansioni/Materiale/${currentImage.image}' alt='img' />`;



                // Aggiunge effetto fade-in
                setTimeout(() => {
                    child.classList.add("show");
                }, 5 * i);

                // Appende l'elemento <div> al <li>
                // node.appendChild(p)
                node.appendChild(child);


                //append event to list item
                node.addEventListener("click", (e) => {
                    if (!e.target.classList.contains('hidden')) {
                        selectItem(e.target)
                    }
                })

                //append list item to list into DOM
                list.appendChild(node);
            }
        }
    }
//appPanel animation
const ul = document.getElementById("list");
const appPanel = document.querySelector(".appPanel");
const container = document.getElementById("container")

ul.addEventListener("scroll", () => {
  if(ul.scrollTop > 450) {
    console.log(ul.crollTop)
    appPanel.classList.remove('appPanel')
    appPanel.classList.add('appPanelMove')
} else {
    appPanel.classList.add('appPanel')
    appPanel.classList.remove('appPanelMove')
  }
});

if (window.innerWidth <= 960) {
    window.addEventListener('touchmove', () => {
        if(ul.scrollTop > 250) {
        // codice per determinare se l'evento di scroll è stato attivato
        document.querySelector('.appPanel').classList.add('appPanelMove');
        }
    });
}

//end appPanel animation
    //START FILTRI RETTANGOLI
    function setRectanglesCount() {
        let buttons = document.querySelectorAll('.rectangle');
        let totalCount = response.images.length;
    
        buttons.forEach((button) => {
            let tag = button.dataset.tag;
            let count = response.images.filter(item => item.subject === tag).length;
            let percentage = (count/totalCount * 100).toFixed(2);
            button.style.background = `linear-gradient(90deg, #ff8a00 ${percentage}%, #cccccc ${percentage}%)`;
            let rectInfo = button.querySelector('.rectInfo');
            let p = document.createElement("p");
            p.innerHTML = `${count} elements`;
            rectInfo.appendChild(p);
        });
    }
    let alreadyClicked = false;
    function setRectanglesFilter() {
        //get all tags from json

        let buttons = document.querySelectorAll('.rectangle');
        //loop through buttons
        buttons.forEach((button) => {
            //attach event to button
            button.addEventListener('click', (e) => {
                console.log(alreadyClicked)
                let tag = e.target.dataset.tag;
                //show all items
                if (alreadyClicked && !e.target.classList.contains('rectangleUnselected')) {
                    insertContent(response);
                    alreadyClicked = false;
                    // remove class from all rectangles
                    buttons.forEach((otherButton) => {
                        otherButton.classList.remove('rectangleUnselected');
                    });
                }
                else {
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
                            if (!item.dataset.subject.includes(tag)) {
                                item.classList.add('filtered');
                            } else { item.classList.remove('filtered') }
                        })
                        alreadyClicked = true
                        buttons.forEach((otherButton) => {
                            otherButton.classList.remove('rectangleUnselected');
                        });
                        buttons.forEach((otherButton) => {
                            if (otherButton !== button) {
                                otherButton.classList.add('rectangleUnselected');
                            }
                        });
                    }

                }
            })
        })
    }
    //END FILTRI RETTANGOLI


    function selectItem(item) {
        // Recupera il nome dell'immagine cliccata
        let imageName = item.querySelector('img').src.split('/').pop().split(".")[0];
        // Crea un nuovo elemento div
        let displayDiv = document.createElement("div");
        displayDiv.classList.add("swiper-container");
        let wrapper = document.createElement("div");
        wrapper.classList.add("swiper-wrapper");
        displayDiv.appendChild(wrapper);
        let paginationDiv = document.createElement("div");
        paginationDiv.classList.add("swiper-pagination");
        displayDiv.appendChild(paginationDiv);

        // let nextButton = document.createElement("div");
        // nextButton.classList.add("swiper-button-next");
        // displayDiv.appendChild(nextButton);

        // let prevButton = document.createElement("div");
        // prevButton.classList.add("swiper-button-prev");
        // displayDiv.appendChild(prevButton);
        // Ciclo attraverso tutti gli elementi della risposta JSON
        let parentCount = 0
        for (let i = 0; i < response.images.length; i++) {
            let currentImage = response.images[i].image.split(".")[0];
            // Controlla se il nome dell'immagine corrente inizia con il nome dell'immagine cliccata
            if (currentImage.startsWith(imageName)) {
                // Crea un nuovo elemento li
                let slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                let lis = Array.from(wrapper.children);
                lis.sort(comparatorNameOfImg);
                lis.forEach(function (slide) {
                    wrapper.appendChild(slide);
                });
                // Crea un nuovo elemento immagine
                let displayedImage = document.createElement("img");
                displayedImage.src = `Scansioni/Materiale/${response.images[i].image}`;
                // Inserisci l'immagine all'interno dello slide
                slide.appendChild(displayedImage);
                // Inserisci lo slide all'interno del wrapper
                wrapper.appendChild(slide);
                // Check if the image is "disco_1" and create a second slide
                if (currentImage === "disco_1" || currentImage === "disco_2") {
                    // Create a new slide element
                    let slide2 = document.createElement("div");
                    slide2.classList.add("swiper-slide");
                    // Create a list element
                    let musicList = document.createElement("ul");
                    for (let i = 0; i < response.canzoni.length; i++) {
                        if (response.canzoni[i].subject === "Songs") {
                            let musicItem = document.createElement("li");
                            musicItem.textContent = response.canzoni[i].track + " "+' | ' + response.canzoni[i].name;
                            musicList.appendChild(musicItem);
                            musicItem.setAttribute("filename", response.canzoni[i].filename)
                        }
                    }
                    // Add the list to the slide
                    slide2.appendChild(musicList);
                    // Add the slide to the wrapper
                    wrapper.appendChild(slide2);

                }
                parentCount++
            }
        }
        // impostare un valore di default
        let slidesPerView = 2;
        if (parentCount < 2) {
            slidesPerView = 1

            // impostare un valore diverso se ci sono più di 2 parenti
            if (imageName === "disco_1") {
                slidesPerView = 2;
            }

        }        
        else if (parentCount > 2) {
            // impostare un valore diverso se ci sono più di 2 parenti
            slidesPerView = 3;
        } else if (parentCount > 10) {
            slidesPerView = 5;
        }
        // Inizializza Swiper
        let mySwiper = new Swiper(displayDiv, {
            slidesPerView: slidesPerView,
            spaceBetween: 10,
            // aggiungi qui gli altri parametri che vuoi utilizzare
        });

        function comparatorNameOfImg(a, b) {
            let srcA = a.querySelector("img").src.split('/').pop().split(".")[0];
            let srcB = b.querySelector("img").src.split('/').pop().split(".")[0];
            if (srcA < srcB) {
                return -1;
            }
            if (srcA > srcB) {
                return 1;
            }
            return 0;
        }



        // Inserisci il div nella pagina HTML
        document.body.appendChild(displayDiv);
        document.addEventListener("click", function (e) {
            console.log(e.target)
            if (!e.target.classList.contains("swiper-slide")) {
                console.log("clicked on displayImage");
            } else {
                // rimuovi il div qui
                displayDiv.remove();
                if (currentAudio) {
                        currentAudio.pause();
            }
        }
        });

        //MusicaMaestro
        let currentAudio;
let activeLi;
let allLiElements = document.querySelectorAll(".swiper-container li");

if (imageName === 'disco_1') {
    allLiElements.forEach((li) => {
        li.addEventListener("click", (e) => {
            allLiElements.forEach((li) => {
                li.classList.remove('song-active');
                li.innerHTML = li.innerHTML.replace(/\(\d+:\d+ min\)/g, "");
            });
            let songName = `Scansioni/Materiale/${e.target.getAttribute("filename")}`;
            if (currentAudio && activeLi === li) {
                currentAudio.pause();
                activeLi = null;
                return;
            }
            if (currentAudio) {
                currentAudio.pause();
            }
            activeLi = li;
            li.classList.add('song-active');
            currentAudio = new Audio(songName);
            currentAudio.play();

            currentAudio.addEventListener("timeupdate", (e) => {
                let percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
                li.style.setProperty('--progress', percentage + '%');


            });

            currentAudio.addEventListener("loadedmetadata", (e) => {
                let minutes = Math.floor(currentAudio.duration / 60);
                let seconds = Math.floor(currentAudio.duration % 60);
                let duration = minutes + ":" + (seconds < 10 ? "0" : "") + seconds
                li.innerHTML += `   (${duration} min)`;
            });
        });
    });
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

    // function setTagsButton() {

    //     //get all tags from json
    //     let buttons = document.querySelectorAll('.rectangle');
    //     //loop through buttons
    //     buttons.forEach((button) => {
    //         //attach event to button
    //         button.addEventListener('click', (e) => {

    //             //get tag value from button
    //             let tag = e.target.dataset.tag;

    //             //show all items
    //             if (tag == '*') {
    //                 insertContent(response);
    //             }
    //             else {
    //                 //insert all content
    //                 insertContent(response);
    //                 //remove all items that don't have the tag
    //                 let items = document.querySelectorAll('.list-item');
    //                 //loop all items
    //                 items.forEach((item) => {
    //                     //check if item has the tag
    //                     if (!item.dataset.tag.includes(tag) && !item.dataset.colors.includes(tag)) {
    //                         list.removeChild(item);
    //                     }
    //                 })
    //             }


    //         })
    //     })
    // }
    window.addEventListener("load", function () {
        setSortButtons();
        // Sort the elements by year
        const sorted = Array.from(document.querySelectorAll('.list-item')).sort(comparatorYear);
        sorted.forEach((item) => document.querySelector("#list").appendChild(item));
        const yearBtn = document.querySelector("[data-sort='year']");
        yearBtn.classList.add("selected")
    });


    //After
    function setSortButtons() {
        // Query DOM elements once and store them in variables
        const buttons = document.querySelectorAll('.button-sort');
        const list = document.querySelector('#list');
        const subjects = document.querySelectorAll('.list-item');

        buttons.forEach((button) => {
            // Use a closure to store the state of each button
            let clicked = false;
            // Attach event to button sort
            button.addEventListener('click', (e) => {

                // Remove the 'selected' class from all buttons
                buttons.forEach((b) => b.classList.remove('selected'));
                // Add the 'selected' class to the clicked button
                e.target.classList.add('selected');
                const sort = e.target.dataset.sort;

                // Create a document fragment to hold the sorted items
                const fragment = document.createDocumentFragment();

                // Sort by year or title
                let sorted = Array.from(subjects);
                if (sort === 'year') {
                    if (clicked) {
                        e.target.innerHTML = "Year - Descending";
                        sorted.sort(comparatorYear).reverse();
                    } else {
                        e.target.innerHTML = "Year - Ascending";
                        sorted.sort(comparatorYear);
                    }
                }
                if (sort === 'title') {
                    if (clicked) {
                        e.target.innerHTML = "Title - Z>A";
                        sorted.sort(comparatorTitle).reverse();
                    } else {
                        e.target.innerHTML = "Title - A>Z";
                        sorted.sort(comparatorTitle);
                    }
                }
                if (sort === 'random') {
                    if (clicked) {
                        e.target.innerHTML = "Random";
                    } 
                sorted = Array.from(subjects).sort(() => Math.random() - 0.5);
                }
                clicked = !clicked;

                // Append the sorted items to the fragment
                    sorted.forEach((item) => fragment.appendChild(item));
             

                // Clear the list and append the sorted items from the fragment
                list.innerHTML = '';
                list.appendChild(fragment);
            });
        });
    }
    
    function comparatorYear(a, b) {
        if (a.dataset.year < b.dataset.year)
            return -1;
        if (a.dataset.year > b.dataset.year)
            return 1;
        return 0;
    }

    function comparatorTitle(a, b) {
        if (a.dataset.image < b.dataset.image) {
            return -1;
        }
        if (a.dataset.image > b.dataset.image) {
            return 1;
        }
        return 0;
    }

    //on key press search
    // let timeout = null;
    // search.addEventListener('keyup', (e) => {
    //     // wait 1000ms after user stops typing
    //     clearTimeout(timeout);
    //     timeout = setTimeout(() => {
    //         //insert all content
    //         insertContent(response);
    //         //get search value
    //         let search = e.target.value.toLowerCase();
    //         //get all items
    //         let items = document.querySelectorAll('.list-item');
    //         items.forEach((item) => {
    //             //if item doesn't have the search value remove it
    //             if (!item.dataset.title.toLowerCase().includes(search.toLowerCase())) {
    //                 list.removeChild(item);
    //             }
    //         })
    //     }, 1000);
    // })

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

    // let setShuffle = false;
    //let's wait at least a second before starting the loop
    // setTimeout(() => {
    //     function drawLoop() {
    //         //if p5 is ready
    //         if (ready) {
    //             //se dal p5.js viene inviato il messaggio di shuffle
    //             if (label == "shuffle" && confidence > 0.9) {
    //                 if (!setShuffle) {
    //                     // randomItem();

    //                     var subjects = document.querySelectorAll('.list-item');
    //                     var subjectsArray = Array.from(subjects);
    //                     let sorted = subjectsArray.sort(comparatorTitle).reverse();
    //                     sorted.forEach(e => document.querySelector("#list").appendChild(e));

    //                     setShuffle = true;
    //                 }
    //             }
    //             else if (label == 'next' && confidence > 0.9) {
    //                 setShuffle = false;
    //                 // nextItem();
    //             }
    //             else {
    //                 setShuffle = false;
    //             }
    //         }
    //         requestAnimationFrame(drawLoop);
    //     }
    //     requestAnimationFrame(drawLoop);
    // }, 1000);

    // HAMMER
    // Crea un'istanza di Hammer per l'elemento #container
    let hammer = new Hammer(document.querySelector("#container"));

    // Ascolta l'evento swipeleft e fa qualcosa
    hammer.on("swipedown", function () {
        console.log("Swipe Down!");
    });

    //SWIPER
    var mySwiper = new Swiper('.swiper-container', {
        // Opzioni
        loop: true,
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            bulletElement: 'span',
            bulletClass: 'my-bullet',
            bulletActiveClass: 'my-bullet-active',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
    });


})();