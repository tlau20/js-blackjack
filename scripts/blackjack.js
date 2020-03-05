const hitBtn = document.getElementById('hit-btn');
const holdBtn = document.getElementById('hold-btn');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const playAgnBtn = document.getElementById('play-again-btn');
const playerCards = document.getElementById('player-cards');
const playerTotal = document.getElementById('player-total');
const dealerCards = document.getElementById('dealer-cards');
const dealerTotal = document.getElementById('dealer-total');
const resultScreen = document.getElementById('result-screen');

const NUM_SWAPS = 1000;
const USER = 'user';
const DEALER = 'dealer';
const suits = ['D', 'C', 'H', 'S'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let playerHand = new Array();
let dealerHand = new Array();
let deck = createDeck();

//create standard deck of 52 cards
function createDeck() {
    let newDeck = new Array();

    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            let card = {
                value: values[j],
                suit: suits[i]
            }
            newDeck.push(card);
        }
    }

    shuffleDeck(newDeck);
    return newDeck;
}

//shuffle deck of cards
//swaps places of 2 cards NUM_SWAPS times
function shuffleDeck(deck) {
    for (var i = 0; i < NUM_SWAPS; i++) {
        let index1 = Math.floor((Math.random() * deck.length));
        let index2 = Math.floor((Math.random() * deck.length));
        let tempCard = deck[index1];
        deck[index1] = deck[index2];
        deck[index2] = tempCard;
    }
}

//deal cards
//deck = deck of cards
//hand = player or dealer hand
//returns list of cards dealt
function deal(deck, hand, numCards, player) {
    let cardsDealt = new Array();
    for (var i = 0; i < numCards; i++) {
        cardsDealt.push(deck[0]);
        hand.push(deck[0]); //deal top card
        deck.shift();
    }

    let totals = calculateTotal(hand);
    switch (player) {
        case USER:
            if (totals.aceTotal > 0) {
                playerTotal.innerText = `${totals.total}/${totals.aceTotal}`;
            } else {
                playerTotal.innerText = totals.total;
            }
            break;
        case DEALER:
            if (totals.aceTotal > 0) {
                dealerTotal.innerText = `${totals.total}/${totals.aceTotal}`;
            } else {
                dealerTotal.innerText = totals.total;
            }
            break;
    }

    return cardsDealt;
}

//calculates total of hand
function calculateTotal(hand) {
    const faceCards = ['J', 'Q', 'K'];
    let total = 0;
    let aceTotal = 0;

    if (hasAce(hand)) {
        hand.forEach(card => {
            if (faceCards.includes(card.value)) {
                total += 10;
                aceTotal += 10;
            } else if (card.value === 'A') {
                total += 11;
                aceTotal += 1;
            } else {
                total += parseInt(card.value);
                aceTotal += parseInt(card.value);
            }
        });
    } else {
        hand.forEach(card => {
            // console.log(card.value + card.suit);
            if (faceCards.includes(card.value)) {
                total += 10;
            } else {
                total += parseInt(card.value);
            }
        });
    }

    return {
        total: total,
        aceTotal: aceTotal
    };
}

//check hand for aces
function hasAce(hand) {
    let ace = false;
    hand.forEach(card => {
        if (card.value === 'A') {
            ace = true;
        }
    });
    return ace;
}

//dealer logic
function dealerTurn () {
    renderCard(deal(deck, dealerHand, 2, DEALER), DEALER);
    let totals = calculateTotal(dealerHand);

    if (hasAce(dealerHand)) {
        if (totals.total == 21) return;
        if (totals.total >= 17 && totals.total < 21) return; //catch cases like 9/A/etc
        if (totals.aceTotal >= 17) return;
        while (totals.aceTotal < 17) {
            if (totals.total < 17) return;
            renderCard(deal(deck, dealerHand, 1, DEALER), DEALER);
            totals = calculateTotal(dealerHand);
        }
    } else {
        while (totals.total < 17 || (hasAce(dealerHand) && totals.aceTotal < 17)) {
            if (totals.total == 21) return;
            renderCard(deal(deck, dealerHand, 1, DEALER), DEALER);
            totals = calculateTotal(dealerHand);
        }
    }
}

//calculate the card totals for a hand
function analyzeHand (hand) {
    let totals = calculateTotal(hand);
    let handData = {
        total: 0,
        bust: false
    };

    if (totals.total == 21 || totals.aceTotal == 21) {
        // console.log('21!');
        // return;
        handData.total = 21;
        return handData;
    }

    if (hasAce(hand)) {
        if (totals.aceTotal > 21) {
            // console.log(`total: ${totals.aceTotal}, bust!`);
            handData.bust = true;
        } else {
            // console.log(`total: ${totals.total}`);
            // console.log(`ace total: ${totals.aceTotal}`);
            // totals.total > totals.aceTotal ? handData.total = totals.total : handData.totals = totals.aceTotal;
            if (totals.total > totals.aceTotal && totals.total <= 21) {
                handData.total = totals.total;
            } else {
                handData.total = totals.aceTotal;
            }
        }
    } else {
        if (totals.total > 21) {
            // console.log(`total: ${totals.total}, bust!`);
            handData.bust = true;
        } else {
            // console.log(`total : ${totals.total}`);
            handData.total = totals.total;
        }
    }

    return handData;
}

function calculateWinner(playerHand, dealerHand) {
    let player = analyzeHand(playerHand);
    let dealer = analyzeHand(dealerHand);

    if (player.bust) {
        showResultScreen('You lost!');
    }
    if (dealer.bust) {
        showResultScreen('You win!');
    }

    if (player.total === dealer.total) {
        showResultScreen('You tied!');
    } else if (player.total > dealer.total) {
        showResultScreen('You win!');
    } else {
        showResultScreen('You lost!');
    }
}

//rendering functions
function renderCard (cards, player) {
    cards.forEach(card => {
        let cardDealt = document.createElement('div');
        let topValue = document.createElement('span');
        let bottomValue = document.createElement('span');
        let suit = document.createElement('h1');

        switch (card.suit) {
            case 'D':
                suit.innerHTML = '\u2666';
                break;
            case 'C':
                suit.innerHTML = '\u2663';
                break;
            case 'H':
                suit.innerHTML = '\u2665';
                break;
            case 'S':
                suit.innerHTML = '\u2660';
                break;
        }

        cardDealt.classList.add('card');
        topValue.classList.add('top-card-value');
        topValue.innerText = card.value;
        bottomValue.classList.add('bottom-card-value')
        bottomValue.innerText = card.value;

        cardDealt.appendChild(topValue);
        cardDealt.appendChild(bottomValue);
        cardDealt.appendChild(suit);

        (player === 'user') ? playerCards.appendChild(cardDealt) : dealerCards.appendChild(cardDealt);
    });
}
//end rendering functions

startBtn.addEventListener('click', function (){
    document.getElementById('start-screen').classList.add('slide-up');
    hideButtons();
});

//add a card to your hand
hitBtn.addEventListener('click', _ => {
    renderCard(deal(deck, playerHand, 1, USER), USER);
    const playerCards = analyzeHand(playerHand);
    if (playerCards.bust) {
        showResultScreen('You lost!');
    } else if (playerCards.total == 21) {
        showResultScreen('Blackjack!');
    }
});

//stay and end your turn
holdBtn.addEventListener('click', _ => {
    // analyzeGameState();
    hideButtons();
    dealerTurn();
    calculateWinner(playerHand, dealerHand);
});

//reset the game
resetBtn.addEventListener('click', _ => {
    resetGame();
});

playAgnBtn.addEventListener('click', function(){
    resetGame();
})

function showResultScreen(result) {
    document.getElementById('result').innerHTML = result;
    resultScreen.style.opacity = 1;
    resultScreen.style.zIndex = 2;
}

function hideButtons() {
    hitBtn.style.textShadow = 'none';
    hitBtn.style.boxShadow = 'none';
    holdBtn.style.textShadow = 'none';
    holdBtn.style.boxShadow = 'none';
    hitBtn.toggleAttribute('disabled');
    holdBtn.toggleAttribute('disabled');
}

function resetGame() {
    deck = createDeck();
    playerHand.length = 0;
    dealerHand.length = 0;
    playerTotal.innerText = '';
    dealerTotal.innerText = '';

    hitBtn.style.textShadow = '2px 2px 2px rgba(0, 0, 0, 0.2), -2px -2px 2px white';
    hitBtn.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 12px white';
    holdBtn.style.textShadow = '2px 2px 2px rgba(0, 0, 0, 0.2), -2px -2px 2px white';
    holdBtn.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 12px white';

    resultScreen.style.opacity = 0;
    resultScreen.style.zIndex = -1;

    if (hitBtn.hasAttribute('disabled')) {
        hitBtn.toggleAttribute('disabled');
    }

    if (holdBtn.hasAttribute('disabled')) {
        holdBtn.toggleAttribute('disabled');
    }

    //delete cards from previous hand
    while (playerCards.firstChild) {
        playerCards.removeChild(playerCards.firstChild);
    }
    while (dealerCards.firstChild) {
        dealerCards.removeChild(dealerCards.firstChild);
    }

    renderCard(deal(deck, playerHand, 2, USER), USER);
}