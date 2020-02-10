const hitBtn = document.getElementById('hit-btn');
const holdBtn = document.getElementById('hold-btn');
const resetBtn = document.getElementById('reset-btn');
const playerCards = document.getElementById('player-cards');
const playerTotal = document.getElementById('player-total');
const dealerCards = document.getElementById('dealer-cards');
const dealerTotal = document.getElementById('dealer-total');

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
        // console.log('Dealt: ' + deck[0].value + deck[0].suit);
        // cardsDealt.push(`${deck[0].value}${deck[0].suit}`); //deal top card of deck
        cardsDealt.push({
            name: `${deck[0].value}${deck[0].suit}`
        });
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
        while (totals.total < 17) {
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
        console.log('You bust!');
    }
    if (dealer.bust) {
        console.log('Dealer bust!');
    }

    if (player.total === dealer.total) {
        console.log('Tie!');
    } else if (player.total > dealer.total) {
        console.log('You win!');
    } else {
        console.log('Dealer wins!');
    }

    // console.log(`Player: ${player.total} Dealer: ${dealer.total}`);
}

//rendering functions
function renderCard (cards, player) {
    cards.forEach(card => {
        let cardDealt = document.createElement('img');
        cardDealt.setAttribute('src', `images/cards/${card.name}.png`);
        cardDealt.classList.add('card');
        (player === 'user') ? playerCards.appendChild(cardDealt) : dealerCards.appendChild(cardDealt);
    })
}
//end rendering functions


//add a card to your hand
hitBtn.addEventListener('click', _ => {
    renderCard(deal(deck, playerHand, 1, USER), USER);
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
    playerTotal.innerText = '';
    dealerTotal.innerText = '';

    if (hitBtn.hasAttribute('disabled')) {
        hitBtn.toggleAttribute('disabled');
    }

    //delete cards from previous hand
    while (playerCards.firstChild) {
        playerCards.removeChild(playerCards.firstChild);
    }
    while (dealerCards.firstChild) {
        dealerCards.removeChild(dealerCards.firstChild);
    }

    renderCard(deal(deck, playerHand, 2, USER), USER);
})

renderCard(deal(deck, playerHand, 2, USER), USER);