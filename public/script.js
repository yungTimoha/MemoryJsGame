import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

const FIREBASE_APP = initializeApp({
    apiKey: "AIzaSyCtloglcn2O_PkjLWyWiLG42vhfBGmeqOQ",
    authDomain: "jsprojects-82c0c.firebaseapp.com",
    projectId: "jsprojects-82c0c",
    storageBucket: "jsprojects-82c0c.appspot.com",
    messagingSenderId: "349275246454",
    appId: "1:349275246454:web:212fd15bdb11779368b457",
    measurementId: "G-Z56SEFCEWL"
});

const analytics = getAnalytics(FIREBASE_APP);

const GAME_NODE = document.querySelector('#game-board');
const VICTORY_TEXT = document.querySelector('#victory-message');
const START_GAME_BUTTON = document.querySelector('#new-game-button');

const VISIBLE_CARD_CLASSNAME = 'visible';
const TIME_FLIP_TIMEOUT_MS = 500;

const CARD_ELEMENTS = ['🍎', '🍐', '🍊', '🍋', '🍉', '🍇'];
const CARD_AMOUNT = 12;

let visibleCards = [];

START_GAME_BUTTON.addEventListener('click', startGame);

function startGame() {
    [GAME_NODE, VICTORY_TEXT].forEach(node => node.innerHTML = '');

    const CARD_VALUES = generateArray(CARD_ELEMENTS, CARD_AMOUNT);
    
    CARD_VALUES.forEach(renderCard);

    const renderedCards = document.querySelectorAll('.card');

    renderedCards.forEach( card => card.classList.add(VISIBLE_CARD_CLASSNAME));

    setTimeout( () => {
        renderedCards.forEach( card => card.classList.remove(VISIBLE_CARD_CLASSNAME));
    }, 1000);
}

function generateArray(elements, cardAmount) {
    const randomArray = [];
    const elementCounts = {};

    for(const element of elements) {
        elementCounts[element] = 0;
    }

    while(randomArray.length < cardAmount) {
        const randomIndex = Math.floor(Math.random() * elements.length);
        const randomElement = elements[randomIndex];
    
        if(elementCounts[randomElement] < 2) {
            randomArray.push(randomElement);
            elementCounts[randomElement]++;
        }
    }

    return randomArray;
}

function renderCard(element) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');

    cardFront.textContent = '?';
    cardBack.textContent = element;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => {
        handleCardClick(card);
    });

    GAME_NODE.appendChild(card);
}

function handleCardClick(card) {

    if (card.classList.contains(VISIBLE_CARD_CLASSNAME)) {
        return;
    }

    const checkVictory = () => {
        const visibleCardNodes = document.querySelectorAll(`.${VISIBLE_CARD_CLASSNAME}`);

        const isVictory = visibleCardNodes.length === CARD_AMOUNT;
        const victoryMessage = 'Победа';

        if (isVictory){
            VICTORY_TEXT.textContent = victoryMessage;
        }
    }

    card.querySelector('.card-inner').addEventListener('transitionend', checkVictory);

    card.classList.add(VISIBLE_CARD_CLASSNAME);

    visibleCards.push(card);

    if (visibleCards.length % 2 !== 0) {
        return;
    }

    const [preLastCard, lastCard] = visibleCards.slice(-2);

    if (lastCard.textContent !== preLastCard.textContent){
        visibleCards = visibleCards.slice(0, visibleCards.length - 2);

        setTimeout( () => {
            lastCard.classList.remove(VISIBLE_CARD_CLASSNAME);
            preLastCard.classList.remove(VISIBLE_CARD_CLASSNAME);
        },  TIME_FLIP_TIMEOUT_MS);
    }
}

startGame();