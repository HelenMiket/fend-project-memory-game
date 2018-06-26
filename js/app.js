/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cards = [...deck.children];

const stars = document.querySelector(".stars");
const threeStars = [...stars.children];
const moves = document.querySelector(".moves");

let openedCards = [];
let matchedCards = [];
let moveCount = 0;
let rating = 3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const restart = document.querySelector(".restart");
restart.addEventListener("click", restartGame, false);

function restartGame() {
    shuffle(cards);
    cards.forEach(function (card) {
        card.classList.remove("match", "open", "show");
    });

    cards.forEach(function (card) {
        deck.appendChild(card);
    });

    openedCards = [];
    matchedCards = [];
    moveCount = 0;
    updateRating();
    updateMoveCount();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];

        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener("click", cardClicked, false);

function cardClicked(evt) {
    moveCount++;

    var target = evt.target;
    if (target.nodeName === "LI") {
        openCard(target);

        if (openedCards.length === 2) {


            if (cardsMatch(openedCards[0], openedCards[1])) {
                lockOpenedCards();
                console.log(matchedCards.length);

                if (matchedCards.length === 16) {
                    showSuccessMessage();
                }
            } else {
                hideOpenedCards();
            }
        }
    }

    updateRating();
    updateMoveCount();
}

function updateRating() {
    const newRating = getRating();
   
    if (rating > newRating) {
        for (let i = newRating; i < rating; i++) {
            stars.removeChild(threeStars[i]);
        }
    }
    else if (rating < newRating) {
        for (let i = rating; i < newRating; i++) {
            stars.appendChild(threeStars[i]);
        }
    }
    rating = newRating;
}

function getRating() {
    if (moveCount <= 4) {
        return 3;
    } else if (moveCount < 10) {
        return 2;
    } else {
        return 1;
    }
}

function updateMoveCount() {
    moves.innerHTML = `${moveCount}`;
}

function openCard(card) {
    card.classList.add("open", "show");
    openedCards.push(card);
}

function hideOpenedCards() {
    openedCards.forEach(function (card) {
        card.classList.remove("open", "show");
    });

    openedCards = [];
}

function cardsMatch(card1, card2) {
    let result = true;

    const iElement1 = card1.querySelector("i");
    const iElement2 = card2.querySelector("i");

    if (iElement1 !== null && iElement2 !== null) {
        const elementClasses1 = iElement1.classList;
        const elementClasses2 = iElement2.classList;

        if (elementClasses1.length === elementClasses2.length) {
            for (let i = 0; i < elementClasses1.length; i++) {
                if (elementClasses1[i] !== elementClasses2[i]) {
                    result = false;
                    break;
                }
            }
        } else {
            result = false;
        }
    }

    return result;
}

function lockOpenedCards() {
    if (openedCards.length !== 2) {
        return;
    }

    const card1 = openedCards[0];
    const card2 = openedCards[1];

    card1.classList.remove("open", "show");
    card2.classList.remove("open", "show");
    card1.classList.add("match");
    card2.classList.add("match");

    matchedCards.push(card1);
    matchedCards.push(card2);
    openedCards = [];
}

// Modal to display a message with the final score
const modal = document.querySelector(".modal");
const score = document.querySelector(".score");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showSuccessMessage() {
    modal.style.display = "block";
    score.innerHTML = `With ${moveCount} moves and ${rating} stars`;
}

const playBtn = document.querySelector(".playBtn");
playBtn.addEventListener("click", playAgain);

function playAgain() {
    modal.style.display = "none";
    restartGame();
}