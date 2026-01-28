const colors = ['red', 'blue', 'green', 'yellow'];
const powers = ['skip', 'reverse', 'DrawTwo', 'wild', 'wildDrawFour'];

let humans_turn = true;

class Deck {
    constructor() {
        this.cards = [];
        for (let color of colors) {
            for (let number = 0; number <= 9; number++) {
                this.cards.push(new Card(color, number, null));
            }
            for (let number = 1; number <= 9; number++) {
                this.cards.push(new Card(color, number, null));
            }
            for (let power of powers.slice(0, 3)) {
                this.cards.push(new Card(color, null, power));
                this.cards.push(new Card(color, null, power));
            }
        }   

        for (let i = 0; i < 4; i++) {
            this.cards.push(new Card(null, null, 'wild'));
            this.cards.push(new Card(null, null, 'wildDrawFour'));
        }
        console.log(`Deck initialized with ${this.cards.length} cards.`);
    }

    printDeck() {
        for (let card of this.cards) {
            console.log(card);
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

class PlayedDeck {
    constructor() {
        this.cards = [];
    }
}

class Card {
    constructor(color, number, power)
    {
        
        this.color = color;
        this.number = number;
        this.power = power;
        
    }
}


class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        
    }


    drawCard(deck, count = 1) {
        for (let i = 0; i < count; i++) {
            if (deck.cards.length > 0) {
                this.hand.push(deck.cards.pop());
            } else {
                console.log('The deck is empty!');
            }
        }
    }

    printhand() {
        console.log(`${this.name}'s hand:`);
        for (let card of this.hand) {
            console.log(card);
        }
    }

}

function RenderHelpBox() {
    const helpBox = document.createElement('div');
    helpBox.id = 'helpBox';
    helpBox.style.position = 'absolute';
    helpBox.style.top = '20px';
    helpBox.style.left = '20px';
    helpBox.style.width = '440px';
    helpBox.style.height = '200px';
    helpBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    helpBox.style.color = 'white';
    helpBox.style.padding = '10px';
    helpBox.style.borderRadius = '10px';
    helpBox.style.zIndex = '1000';
    helpBox.style.fontFamily = 'Arial, sans-serif';
    helpBox.style.fontSize = '20px';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.padding = '0';
    closeButton.style.lineHeight = '1';
    closeButton.onclick = function() {
        helpBox.style.display = 'none';
    };
    closeButton.onmouseover = function() {
        closeButton.style.backgroundColor = 'rgba(255, 0, 0, 1)';
    };
    closeButton.onmouseout = function() {
        closeButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    };
    
    helpBox.innerHTML = `
        <h3>Game Controls</h3>
        <ul>
            <li>Click on a card in your hand to play it.</li>
            <li>Click on the draw pile to draw a card.</li>
            <li>Press 'h' for a hint.</li>
            <li>Press 'r' to reset the game.</li>
        </ul>
    `;
    helpBox.appendChild(closeButton);
    document.body.appendChild(helpBox);
}


function HumanDraw(){
    if (!humans_turn) {
        console.log("It's not your turn!");
        return;
    }
    humans_turn = false;
    HumanPlayer.drawCard(deck, 1);
    renderHand();
    renderDrawPile();

    AITurn();
    
}

function resetGame() {
    // Check if the page is inside an iframe
    if (window.self !== window.top) {
        // Inside an iframe - reset game state
        console.log("Resetting game within iframe...");
        
        // Reset game variables
        humans_turn = true;
        HumanPlayer.hand = [];
        AIPlayer.hand = [];
        playedDeck.cards = [];
        
        // Create fresh deck
        deck = new Deck();
        deck.shuffle();
        
        // Deal initial cards
        HumanPlayer.drawCard(deck, 7);
        AIPlayer.drawCard(deck, 7);
        
        // Play first card
        playedDeck.cards.push(deck.cards.pop());
        
        // Re-render everything
        renderHand();
        renderAIHand();
        renderPlayArea();
        renderDrawPile();
        
        console.log("Game reset complete!");
    } else {
        // Not in an iframe - refresh the page
        console.log("Refreshing page...");
        location.reload();
    }
}

function renderPlayArea() {
    const playSpace = document.getElementById('playSpace');
    playSpace.innerHTML = '';
    // console.log('Rendering play area with top card:', playedDeck.cards[playedDeck.cards.length - 1]);
    // console.log(playSpace);
    // playSpace.innerHTML = '';

    if (playedDeck.cards.length > 0) {
        const topCard = playedDeck.cards[playedDeck.cards.length - 1];
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        cardDiv.style.position = 'absolute';
        cardDiv.style.rotate = (Math.random() * 10 - 5) + 'deg';
        cardDiv.style.width = '200px';
        cardDiv.style.height = '280px';
        cardDiv.style.backgroundSize = 'cover';
        cardDiv.style.backgroundPosition = 'center';
        cardDiv.style.border = '1px solid #ccc';
        cardDiv.style.display = 'flex';
        cardDiv.style.justifyContent = 'center';
        cardDiv.style.alignItems = 'center';
        cardDiv.style.fontSize = '48px';
        cardDiv.style.fontWeight = 'bold';
        cardDiv.textContent = topCard.number;

        if (topCard.power === 'DrawTwo') {
            cardDiv.textContent = '+2';
        } else if (topCard.power === 'wildDrawFour') {
            cardDiv.textContent = '+4';
        } else if (topCard.power === 'wild') {
            cardDiv.textContent = 'W';
        } else if (topCard.power === 'skip') {
            cardDiv.textContent = '⏭';
        } else if (topCard.power === 'reverse') {
            cardDiv.textContent = '🔄';
        } else {
            cardDiv.textContent = topCard.number;
        }

        if (topCard.color) {
            cardDiv.style.backgroundImage = `url('img/${topCard.color}.webp')`;
        } else {
            cardDiv.style.backgroundImage = `url('img/wild.webp')`;
            cardDiv.style.color = 'black';
        }

        playSpace.appendChild(cardDiv);
    }
    
    
}



function renderDrawPile() {
    const drawPile = document.getElementById('drawPile');
    while (drawPile.firstChild) {
        drawPile.removeChild(drawPile.firstChild);
    }
    drawPile.textContent = '';
    for (let i = 0; i < deck.cards.length; i++) {
        const backCard = document.createElement('div');
        backCard.style.position = 'absolute';
        backCard.style.width = '200px';
        backCard.style.height = '280px';
        backCard.style.backgroundImage = `url('img/back.webp')`;
        backCard.style.backgroundSize = 'cover';
        backCard.style.backgroundPosition = 'center';
        backCard.style.border = '1px solid #ccc';
        backCard.style.top = (i * 0.5) + 'px';
        backCard.style.left = (i * 0.5) + 'px';
        backCard.style.rotate = (Math.random() * 10 - 5) + 'deg';
        drawPile.appendChild(backCard);
    }
}

function renderHand() {
    const grid = document.getElementById('handGrid');
    grid.innerHTML = '';

    const cardCount = HumanPlayer.hand.length;

    // Group identical cards together
    const cardGroups = {};
    
    for (let i = 0; i < cardCount; i++) {
        const card = HumanPlayer.hand[i];
        const cardKey = `${card.color}-${card.number}-${card.power}`;
        
        if (!cardGroups[cardKey]) {
            cardGroups[cardKey] = [];
        }
        cardGroups[cardKey].push({ card, index: i });
    }

    const numGroups = Object.keys(cardGroups).length;
    const viewportWidth = window.innerWidth;
    const maxHeight = window.innerHeight * 0.25;
    
    // Calculate card dimensions to fit all groups in one row
    let cardWidth = Math.floor((143 / 200) * maxHeight);
    let cardHeight = maxHeight;
    
    // If cards don't fit in width, shrink them
    const totalWidthNeeded = cardWidth * numGroups;
    if (totalWidthNeeded > viewportWidth) {
        cardWidth = Math.floor(viewportWidth / numGroups);
        cardHeight = Math.floor((200 / 143) * cardWidth);
        
        // Ensure height doesn't exceed max
        if (cardHeight > maxHeight) {
            cardHeight = maxHeight;
            cardWidth = Math.floor((143 / 200) * cardHeight);
        }
    }
    
    const fontSize = Math.floor((cardWidth / 143) * 80);

    // Set grid styles for horizontal line
    grid.style.display = 'flex';
    grid.style.flexDirection = 'row';
    grid.style.alignItems = 'flex-end';
    grid.style.justifyContent = 'center';
    grid.style.gap = '0';

    // Render each group of cards
    Object.values(cardGroups).forEach((cardList) => {
        const groupContainer = document.createElement('div');
        groupContainer.style.position = 'relative';
        groupContainer.style.width = cardWidth + 'px';
        groupContainer.style.height = cardHeight + 'px';

        cardList.forEach((cardData, stackIndex) => {
            const card = cardData.card;
            const cell = document.createElement('div');
            cell.classList.add('card');

            // Set card text
            if (card.power === 'DrawTwo') {
                cell.textContent = '+2';
            } else if (card.power === 'wildDrawFour') {
                cell.textContent = '+4';
            } else if (card.power === 'wild') {
                cell.textContent = 'W';
            } else if (card.power === 'skip') {
                cell.textContent = '⏭';
            } else if (card.power === 'reverse') {
                cell.textContent = '🔄';
            } else {
                cell.textContent = card.number;
            }

            // Style the card
            cell.style.fontSize = fontSize + 'px';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.fontWeight = 'bold';
            cell.style.width = cardWidth + 'px';
            cell.style.height = cardHeight + 'px';
            cell.style.backgroundSize = 'cover';
            cell.style.backgroundPosition = 'center';
            cell.style.border = '1px solid #ccc';
            cell.style.position = 'absolute';
            cell.style.zIndex = stackIndex;
            cell.style.boxShadow = `0 ${4 + stackIndex * 2}px ${6 + stackIndex * 2}px rgba(0, 0, 0, 0.3 + stackIndex * 0.1)`;
            cell.onclick = humanplayHelper.bind(null, card);

            // Offset stacked cards slightly
            const offset = stackIndex * 15;
            cell.style.transform = `translateY(${offset}px) translateX(${offset}px)`;

            // Set background image based on card color
            if (card.color) {
                cell.style.backgroundImage = `url('img/${card.color}.webp')`;
            } else {
                cell.style.backgroundImage = `url('img/wild.webp')`;
                cell.style.color = 'black';
            }

            // Add click handler
            cell.addEventListener('click', function() {
                console.log('Card clicked:', card);
                // You can add card play logic here
            });

            groupContainer.appendChild(cell);
        });

        grid.appendChild(groupContainer);
    });
}


let HumanPlayer = new Player('Human');
let AIPlayer = new Player('AI');
let playedDeck = new PlayedDeck();
let deck = new Deck();
deck.shuffle();
playedDeck.cards.push(deck.cards.pop());

function renderAIHand() {
        const aiDisplay = document.getElementById('aiHandDisplay');
        aiDisplay.innerHTML = '';
        
        const aiCardCount = AIPlayer.hand.length;
        const maxAIHeight = window.innerHeight * 0.25;
        const aiCardWidth = Math.floor((143 / 200) * maxAIHeight * 0.6);
        const aiCardHeight = Math.floor((200 / 143) * aiCardWidth);
        
        const cardsToShow = Math.min(aiCardCount, 10);
        
        // Create container for fan effect
        const handContainer = document.createElement('div');
        handContainer.style.position = 'relative';
        handContainer.style.width = '500px';
        handContainer.style.height = '250px';
        
        for (let i = 0; i < cardsToShow; i++) {
            const backCard = document.createElement('div');
            backCard.style.width = aiCardWidth + 'px';
            backCard.style.height = aiCardHeight + 'px';
            backCard.style.backgroundImage = `url('img/back.webp')`;
            backCard.style.backgroundSize = 'cover';
            backCard.style.backgroundPosition = 'center';
            backCard.style.border = '1px solid #ccc';
            backCard.style.position = 'absolute';
            backCard.style.display = 'flex';
            backCard.style.justifyContent = 'center';
            backCard.style.alignItems = 'center';
            backCard.style.transformOrigin = 'center top';
            
            // Calculate rotation and position for fan effect
            const angleSpread = 60;
            const centerAngle = (cardsToShow - 1) / 2;
            const cardAngle = (i - centerAngle) * (angleSpread / (cardsToShow - 1 || 1));
            const radius = 150;
            
            const radians = (cardAngle * Math.PI) ;
            const x = Math.sin(radians) * radius;
            const y = Math.cos(radians) * radius - radius;
            
            backCard.style.left = 'calc(50% - ' + (aiCardWidth / 2) + 'px + ' + x + 'px)';
            backCard.style.top = Math.max(0, y) + 'px';
            backCard.style.transform = `rotate(${cardAngle}deg)`;
            backCard.style.zIndex = i;
            
            if (aiCardCount > 10 && i === cardsToShow - 1) {
                backCard.style.color = 'white';
                backCard.style.fontSize = '14px';
                backCard.style.fontWeight = 'bold';
                backCard.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
                backCard.textContent = `+${aiCardCount - cardsToShow}`;
            }
            
            handContainer.appendChild(backCard);
        }
        
        aiDisplay.appendChild(handContainer);
    }


document.addEventListener('DOMContentLoaded', function() {
    RenderHelpBox();
    const style = document.createElement('style');
    // style.textContent = ;
    document.head.appendChild(style);
    HumanPlayer.hand = [];
    HumanPlayer.drawCard(deck, 7);
    AIPlayer.hand = [];
    AIPlayer.drawCard(deck, 7);

    const mainDiv = document.createElement('div');
    mainDiv.classList.add('main');
    document.body.appendChild(mainDiv);
    
    // AI Hand Display (top 25%)
    const aiHandDisplay = document.createElement('div');
    aiHandDisplay.id = 'aiHandDisplay';
    aiHandDisplay.style.position = 'absolute';
    aiHandDisplay.style.top = '0';
    aiHandDisplay.style.left = '0';
    aiHandDisplay.style.width = '100vw';
    aiHandDisplay.style.height = '25vh';
    aiHandDisplay.style.display = 'flex';
    aiHandDisplay.style.justifyContent = 'center';
    aiHandDisplay.style.alignItems = 'center';
    
    
    
    mainDiv.appendChild(aiHandDisplay);
    

    // Play space (center)
    const playSpace = document.createElement('div');
    playSpace.id = 'playSpace';
    playSpace.style.position = 'absolute';
    playSpace.style.top = '25vh';
    playSpace.style.left = '50%';
    playSpace.style.top = '50%';
    playSpace.style.transform = 'translate(-50%, -50%)';
    playSpace.style.width = '300px';
    playSpace.style.height = '300px';
    playSpace.style.border = '3px dashed rgba(255, 255, 255, 0.5)';
    playSpace.style.borderRadius = '10px';
    playSpace.style.display = 'flex';
    playSpace.style.justifyContent = 'center';
    playSpace.style.alignItems = 'center';
    playSpace.style.fontSize = '24px';
    playSpace.style.color = 'rgba(255, 255, 255, 0.6)';
    playSpace.style.fontWeight = 'bold';

    mainDiv.appendChild(playSpace);

    const drawPile = document.createElement('div');
    drawPile.id = 'drawPile';
    drawPile.style.position = 'absolute';
    drawPile.style.top = '50%';
    drawPile.style.left = 'calc(50% - 450px)';
    drawPile.style.transform = 'translateY(-50%)';
    drawPile.style.width = '200px';
    drawPile.style.height = '280px';
    // drawPile.style.backgroundImage = `url('img/back.webp')`;
    drawPile.style.backgroundSize = 'cover';
    drawPile.style.backgroundPosition = 'center';
    drawPile.style.border = '1px solid #ccc';
    drawPile.onclick = HumanDraw;
    mainDiv.appendChild(drawPile);
    
    const grid = document.createElement('div');
    grid.id = 'handGrid';
    grid.style.display = 'flex';
    grid.style.justifyContent = 'center';
    grid.style.alignItems = 'flex-end';
    grid.style.paddingBottom = '80px';
    grid.style.gap = 1 + 'px';
    mainDiv.appendChild(grid);

    renderHand();
    renderAIHand();
    renderPlayArea();
    renderDrawPile();

});

document.addEventListener('keydown', function(event) {
    if (event.key === 'h') {
        renderHint();
    } else if (event.key === 'r') {
        resetGame();
    } else if (event.key === 'd') {
        WIN();
    } else if (event.key === 'l') {
        LOST();
    }
        
});




function renderHint() {
    const handGrid = document.getElementById('handGrid');
    const playCard = playedDeck.cards[playedDeck.cards.length - 1];
    
    const playColor = playCard.color;
    const playNumber = playCard.number;
    const playPower = playCard.power;

    console.log('Play card for hint:', playCard);

    for (let i = 0; i < handGrid.children.length; i++) {
        const cardDiv = handGrid.children[i];
        const card = HumanPlayer.hand[i];

        if (card.color === playColor || card.number === playNumber ) {
            // cardDiv.style.borderRadius = '15px';
            cardDiv.style.border = '8px solid red';
        } else {
            // cardDiv.style.width = '50px';
        }
}
}

function humanplayHelper(card) {
    const cardIndex = HumanPlayer.hand.indexOf(card);
    console.log('Human playing card at index:', cardIndex, card);
    humanPlay(cardIndex);
}

function PickColor() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const popup = document.createElement('div');
    popup.id = 'colorPickerPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.border = '2px solid black';
    popup.style.zIndex = '1000';

    const title = document.createElement('h3');
    title.textContent = 'Pick a color:';
    popup.appendChild(title);

    colors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.textContent = color;
        colorButton.style.backgroundColor = color;
        colorButton.style.color = 'white';
        colorButton.style.margin = '5px';
        colorButton.onclick = function() {
            console.log('Color picked:', color);
            playedDeck.cards[playedDeck.cards.length - 1].color = color;
            document.body.removeChild(popup);
            console.log('Updated top card:', playedDeck.cards[playedDeck.cards.length - 1]);
            // Continue game logic here
        };
        popup.appendChild(colorButton);
    });
    document.body.appendChild(popup);
    
}
function WIN(){
    const main = document.querySelector('.main');
    const playSpace = document.getElementById('playSpace');
    playSpace.innerHTML = 'YOU WIN!';
    const AIHAND = document.getElementById('aiHandDisplay');
    AIHAND.innerHTML = '';

    const hand = document.getElementById('handGrid');
    hand.innerHTML = '';

    const drawPile = document.getElementById('drawPile');
    drawPile.innerHTML = '';
    drawPile.onclick = null;
    main.style.backgroundImage = `url('img/Fireworks_looped.gif')`;
    main.style.backgroundSize = 'cover';
    main.style.backgroundPosition = 'center';
}
function LOST (){
    const main = document.querySelector('.main');
    const playSpace = document.getElementById('playSpace');
    playSpace.innerHTML = 'YOU LOST!';
    const AIHAND = document.getElementById('aiHandDisplay');
    AIHAND.innerHTML = '';

    const drawPile = document.getElementById('drawPile');
    drawPile.innerHTML = '';
    drawPile.onclick = null;

    const hand = document.getElementById('handGrid');
    hand.innerHTML = '';
    main.style.backgroundImage = `url('img/lost.webp')`;
    main.style.backgroundSize = 'cover';
    main.style.backgroundPosition = 'center';
}
function humanPlay(cardIndex) {

    if (!humans_turn) {
        console.log("It's not your turn!");
        AITurn();
        return;
    }

    const card = HumanPlayer.hand[cardIndex];
    const playCard = playedDeck.cards[playedDeck.cards.length - 1];
    console.log(playCard);
    console.log(card.power == "reverse" || card.power == "skip" );
    console.log(card.color === playCard.color );
    if ((card.power == "reverse" || card.power == "skip" ) ) {
        if (card.power != playCard.power ) {
        if (card.color != playCard.color ) {
            console.log("You can't play that card!");
            return;
        }}
        playedDeck.cards.push(card);
        HumanPlayer.hand.splice(cardIndex, 1);
        renderHand();
        renderPlayArea();
        humans_turn = true; // Human gets another turn
        console.log("You played a " + card.power + "! You get another turn.");
    
    } else if (card.power == "DrawTwo" ) {
        if (card.power != playCard.power ) {
        if (card.color !== playCard.color) {
            console.log("You can't play that card!");
            return;
        }}
        console.log("Drawing 2 cards for AI");
        AIPlayer.drawCard(deck, 2);
        playedDeck.cards.push(card);
        HumanPlayer.hand.splice(cardIndex, 1);
        renderHand();
        renderPlayArea();
        humans_turn = false;
        AITurn();
    } else if (card.power == "wild" || card.power == "wildDrawFour") {
        PickColor();
        if (card.power == "wildDrawFour") {
            AIPlayer.drawCard(deck, 4);
            console.log("the AI now has " + AIPlayer.hand.length + " cards");
        }
        playedDeck.cards.push(card);
        HumanPlayer.hand.splice(cardIndex, 1);
        renderHand();
        renderPlayArea();
        
        
        humans_turn = false;
    } else if (card.color === playCard.color || card.number === playCard.number ) {
        playedDeck.cards.push(card);
        HumanPlayer.hand.splice(cardIndex, 1);
        renderHand();
        renderPlayArea();
        humans_turn = false;
        AITurn();
    }else {
        console.log("You can't play that card!");
    }   

    if (HumanPlayer.hand.length == 0) {
    WIN();
    }
}


function AITurn() {
    
    console.log("AI's turn");
    console.log("AI has " + AIPlayer.hand.length + " cards");
    let played = false;
    const playCard = playedDeck.cards[playedDeck.cards.length - 1];

    for (let i = 0; i < AIPlayer.hand.length; i++) {
        const card = AIPlayer.hand[i];
        console.log("AI considering: ", card);
        if (card.power == "DrawTwo" ) {
            console.log("color match:", card.color == playCard.color);
            if (playCard.color == card.color) {
            let pre = HumanPlayer.hand.length;
            HumanPlayer.drawCard(deck, 2);
            playedDeck.cards.push(card);
            let post = HumanPlayer.hand.length;
            if ((!post - pre == 2)) alert( "Human should have drawn 2 cards");

            AIPlayer.hand.splice(i, 1);
            played = true;
            console.log("AI plays: ", card);
            renderHand();
            humans_turn = true;

            break;
        }  else {
            continue;
        }
    }
        console.log(card.power == "reverse" || card.power == "skip" );
        console.log(card.color === playCard.color );
        if (card.power == "reverse" || card.power == "skip" )  {
            if (card.color != playCard.color ) {
                continue;
            }
        
            playedDeck.cards.push(card);
            AIPlayer.hand.splice(i, 1);
            played = true;
            humans_turn = false;
                        console.log("AI plays: ", card);

            AITurn() // AI gets another turn
            break;
        } else if (card.power == "wild" || card.power == "wildDrawFour") {
            if (card.power == "wildDrawFour") {
                HumanPlayer.drawCard(deck, 4);
                console.log("the Human now has " + HumanPlayer.hand.length + " cards");
            }
            playedDeck.cards.push(card);
            AIPlayer.hand.splice(i, 1);
                        console.log("AI plays: ", card);

            // Pick a random color
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            console.log("AI picked color: " + randomColor);
            playedDeck.cards[playedDeck.cards.length - 1].color = randomColor;
            console.log("AI picked color: " + randomColor);
            played = true;
            break;
        } 
        console.log(playCard);
        console.log("color match:", card.color === playCard.color);
        console.log("number match:", card.number === playCard.number);
        if (card.color === playCard.color || card.number === playCard.number ) {
            playedDeck.cards.push(card);
            AIPlayer.hand.splice(i, 1);
            played = true;
            console.log("AI plays: ", card);
            break;
        } 
    }

    if (!played) {
        console.log("AI draws a card");
        AIPlayer.drawCard(deck, 1);
    }

    renderHand();
    renderAIHand();
    renderPlayArea();
    humans_turn = true;

    if (AIPlayer.hand.length == 0) {
    console.log("AI Wins!");
    LOST();
    return;
    }
}