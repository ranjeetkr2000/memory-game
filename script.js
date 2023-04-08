let gifsArr = [];

let oneFlipped = false;
let pairSelected = false;

let maxFlipCount = 0;
let successFlips = 0;
let noOfFlips = 0;

let firstCard, secondCard;

const cardsContainer = document.querySelector(".cards_container");

const playBtn = document.getElementById("play_btn");
playBtn.addEventListener("click", () => {
    let home = document.getElementById("hero_section");
    home.style.display = "none";
    let game = document.getElementById("game_section");
    game.style.display = "flex";

    
    removeContainer();
    removeSuccess();
    maxFlipCount = 0;
    noOfFlips = 0;
    gifsArr = getAllCards();
    gifsArr = shuffle(gifsArr);
    createDivsForGifs(gifsArr);
    updateScore(0);
});

const exitBtn = document.getElementById("exit_btn");
exitBtn.addEventListener("click", () => {
    let home = document.getElementById("hero_section");
    home.style.display = "flex";
    let game = document.getElementById("game_section");
    game.style.display = "none";

    removeContainer();
    removeSuccess(); 
});

const restartBtn = document.getElementById("restart_btn");
restartBtn.addEventListener("click", () => {

    removeContainer();
    removeSuccess();

    setTimeout(() => {
        gifsArr = getAllCards();
        gifsArr = shuffle(gifsArr);
        createDivsForGifs(gifsArr);

        maxFlipCount = 0;
        noOfFlips = 0;
        updateScore(0);
    }, 0.2 * 1000);
});


function getAllCards(len = 12) {
    let gifs = Array(len)
        .fill(0)
        .map((element, index) => {
            return `${index + 1}.gif`;
        });
    gifs.push(...gifs);
    return gifs;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForGifs(gifsArray) {

    const container = document.createElement("div");
    container.className = "container";

    let scores_div = document.querySelector(".scores");
    scores_div.style.display = "";

    for (let gif of gifsArray) {

        const frontFace = document.createElement("img");
        frontFace.className = "front_face";
        frontFace.src = "./images/question-mark.png";

        const backFace = document.createElement("img");
        backFace.className = "back_face";
        backFace.src = `./gifs/${gif}`;

        // give it a class attribute for the value we are looping over
        const newDiv = document.createElement("div");
        newDiv.classList.add("card", gif);
        newDiv.append(frontFace, backFace);

        // call a function handleCardClick when a div is clicked on
        newDiv.addEventListener("click", handleCardClick);

        container.appendChild(newDiv);
        // append the div to the element with an id of game
        cardsContainer.append(container);
    }
}

// TODO: Implement this function!
function handleCardClick(event) {
    // you can use event.target to see which element was clicked
    if(pairSelected){
        return;
    }
    if(gifsArr.length === 0){
        return;
    }
    else if(!this.classList.contains("flip")){
        event.currentTarget.classList.add("flip");
        maxFlipCount++;
        noOfFlips++;
        updateScore(noOfFlips);
        if(maxFlipCount < 2){
            firstCard = this;
        } else {
            pairSelected = true;
            secondCard = this;
            checkCard(firstCard, secondCard);
        }
    }      
    else {
        return;
    }
}

function checkCard(firstCard, secondCard) {
    if(firstCard.classList[1] === secondCard.classList[1]){
        successFlips += 2;
        removeFromArr(firstCard.classList[1]);
        resetCards();
        if(gifsArr.length === 0){
            let container = document.querySelector(".container");
            container.remove();

            updateScore(noOfFlips);
            updateBestScore(noOfFlips);
            showSuccess();

            return;
        }
    }
    else{
        wrongCards(firstCard, secondCard);
    }
    maxFlipCount = 0;
}

function wrongCards(firstCard, secondCard) {  
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetCards();
    }, 1 * 1000)
}

function updateScore(score){
    let currScore = document.getElementById("curr_score");
    currScore.innerText = `Flips: ${score}`;
}

function updateBestScore(score){
    let bestScore = localStorage.getItem("bestScore");
    if(bestScore){
        if(bestScore > score && score !== 0){
            localStorage.setItem("bestScore", score);
        }
    }
    else {
        localStorage.setItem("bestScore", score);
    }
    document.getElementById("best_score").innerText = `Best: ${localStorage.getItem('bestScore')}`;
}

function showSuccess(){
    let successDiv = document.createElement("div");
    successDiv.className = "success_div";
    
    let successMessage = document.createElement("h1");
    successMessage.innerText = "Game Over !";

    let yourScore = document.createElement("div");
    yourScore.innerText = `Flips: ${noOfFlips}`;

    let bestScore = document.createElement("div");
    bestScore.innerText = `Best: ${localStorage.getItem("bestScore")}`;

    successDiv.append(successMessage, yourScore, bestScore);

    cardsContainer.appendChild(successDiv);

    let scores_div = document.querySelector(".scores");
    scores_div.style.display = "none";
}

function removeSuccess(){
    let successDiv = document.querySelector(".success_div");
    if(successDiv){
        successDiv.remove();
    }
    else{
        return;
    }
}

function removeContainer(){
    let container = document.querySelector(".container");
    if(container){
        container.remove();
    }
    else{
        return;
    }
}

function removeFromArr(gifToRemove){
    if(gifsArr.length > 0 && gifsArr.includes(gifToRemove)){
        gifsArr = gifsArr.filter((currentGif) => {
            return currentGif !== gifToRemove;
        });
    }
    else {
        return;
    }
}

function resetCards(){
    oneFlipped = false;
    pairSelected = false;
}