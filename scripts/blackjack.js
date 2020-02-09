const hitBtn = document.getElementById('hit-btn');
const holdBtn = document.getElementById('hold-btn');
const resetBtn = document.getElementById('reset-btn');
const NUM_SWAPS = 1000;

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
function deal(deck, hand, numCards) {
    let cardsDealt = new Array();
    for (var i = 0; i < numCards; i++) {
        console.log('Dealt: ' + deck[0].value + deck[0].suit); 
        cardsDealt.push(`${deck[0].value}${deck[0].suit}`); //deal top card of deck
        hand.push(deck[0]); //deal top card
        deck.shift();
    }
    return cardsDealt;
}

//calculates total of hand
function calculateTotal(hand) {
    const faceCards = ['J', 'Q', 'K'];
    let cardTotals = new Array();
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

    cardTotals.push(total);
    cardTotals.push(aceTotal);
    return cardTotals;
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

//calculate the card totals for a hand
function analyzeHand (hand) {
    let totals = calculateTotal(hand);

    if (totals[0] == 21 || totals[1] == 21) {
        console.log('You win!');
        return;
    }

    if (hasAce(hand)) {
        if (totals[1] > 21) {
            console.log(`total: ${totals[1]}, bust!`);
        } else {
            console.log(`total: ${totals[0]}`);
            console.log(`ace total: ${totals[1]}`);
        }
    } else {
        if (totals[0] > 21) {
            console.log(`total: ${totals[0]}, bust!`);
        } else {
            console.log(`total : ${totals[0]}`);
        }
    }
}

//dealer logic
//TODO: add checks for if dealer goes over 21
function dealerTurn () {
    deal(deck, dealerHand, 2);
    let totals = calculateTotal(dealerHand);

    if (hasAce(dealerHand)) {
        if (totals[0] == 21) return;
        if (totals[0] >= 17) return;
        while (totals[1] < 17) {
            deal(deck, dealerHand, 1);
            totals = calculateTotal(dealerHand);
        }
    } else {
        while (totals[0] < 17) {
            if (totals[0] == 21) return;
            deal(deck, dealerHand, 1);
            totals = calculateTotal(dealerHand);
        }
    }
}

function calculateWinner(playerHand, dealerHand) {
    const playerTotals = calculateTotal(playerHand);
    const dealerTotals = calculateTotal(dealerHand);

    let playerTotal = 0;
    let dealerTotal = 0;

    if (hasAce(playerHand)) {
        if (playerTotals[0] > 21) {
            playerTotal = playerTotals[1];
        } else {
            playerTotal = playerTotals[0];
        }
    } else {
        playerTotal = playerTotals[0];
    }

    if (hasAce(dealerHand)) {
        if (dealerTotals[0] > 21) {
            dealerTotal = dealerTotals[1];
        } else {
            dealerTotal = dealerTotals[0];
        }
    } else {
        dealerTotal = dealerTotals[0];
    }

    if (playerTotal > dealerTotal) {
        console.log('You win!');
    } else {
        console.log('Dealer wins!');
    }

    console.log(`${playerTotal} , ${dealerTotal}`);
}

const cardArea = document.getElementById('card-display');

//rendering functions
function renderCard (cards) {
    cards.forEach(card => {
        let cardDealt = document.createElement('img');
        cardDealt.setAttribute('src', `images/cards/${card}.png`);
        cardDealt.classList.add('card');
        cardArea.append(cardDealt);
    })
}
//end rendering functions


//add a card to your hand
hitBtn.addEventListener('click', _ => {
    let cardDealt = deal(deck, playerHand, 1);
    renderCard(cardDealt);
    analyzeHand(playerHand);
});

//stay and end your turn
holdBtn.addEventListener('click', _ => {
    // analyzeGameState();
    hitBtn.toggleAttribute('disabled');
    dealerTurn();
    calculateWinner(playerHand, dealerHand);
});

//reset the game
resetBtn.addEventListener('click', _ => {
    deck = createDeck();
    playerHand.length = 0;
    dealerHand.length = 0;
    if (hitBtn.hasAttribute('disabled')) {
        hitBtn.toggleAttribute('disabled');
    }
    deal(deck, playerHand, 2);
})


renderCard(deal(deck, playerHand, 2));