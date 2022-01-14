"use strict";
const root = document.querySelector(':root');
let main = document.querySelector('main');
let deck = document.querySelector('.deck');
let debouncer;

function cardElement() {
	let svg = document.createElement("img");
	svg.src = "cards/back.svg";
	return svg;
}

deck.append(...Array.from({length: 40}, cardElement));

function setColumns(columns) {
	root.style.setProperty('--columns', columns);
}

function resizeDeck() {
	requestAnimationFrame(function() {
		let columns = 2
		setColumns(columns);
		
		while(main.scrollHeight > main.clientHeight)
			setColumns(++columns);
	});
};

let img = document.querySelector('img');

if (img.naturalHeight)
	resizeDeck();
else
	img.addEventListener('load', resizeDeck);

window.addEventListener('resize', function() {
	clearTimeout(debouncer);
	debouncer = setTimeout(resizeDeck, 100);
});

let cards = [];

for (let suit of ["club", "diamond", "heart", "spade"]) {
	for (let number = 1; number <= 10; number++)
		cards.push({number, suit});
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	
	return array;
}

shuffle(cards);

let picked = null;
let toTurn = [];

function turnCards() {
	for (let card of toTurn)
		card.element.src = "cards/back.svg";
	
	toTurn = [];
}

function pick(card) {
	card.element.src = `cards/${card.suit}${card.number}.svg`;
	
	if (picked) {
		if (picked.number == card.number && picked.suit == card.number)
			return;
		
		if (picked.number != card.number)
			toTurn.push(picked, card);
		
		picked = null;
	}
	else {
		turnCards();
		picked = card;
	}
}

for (let i = 0; i < 40; i++) {
	let card = cards[i];
	card.element = deck.children[i];
	card.element.addEventListener('click', () => pick(card));
} 