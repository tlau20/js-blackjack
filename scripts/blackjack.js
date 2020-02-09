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
    let deck = new Array();

    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
            let card = {
                value: values[j],
                suit: suits[i]
            }
            deck.push(card);
        }
    }

    shuffleDeck(deck);
    return deck;
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
function deal(deck, hand, numCards) {
    for (var i = 0; i < numCards; i++) {
        console.log('Dealt: ' + deck[0].value + deck[0].suit);
        hand.push(deck[0]); //deal top card
        deck.shift();
    }
}

//calculates total of hand
function calculateTotal(hand) {
    let faceCards = ['J', 'Q', 'K'];
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

//get another card
function hit(deck, hand) {
    deal(deck, hand, 1);
}

//add a card to your hand
hitBtn.addEventListener('click', _ => {
    hit(deck, playerHand);
    analyzeGameState();
});

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

function analyzeGameState () {
    let totals = calculateTotal(playerHand);

    if (hasAce(playerHand)) {
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

deal(deck, playerHand, 2);