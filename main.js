"use strict";
const root = document.querySelector(':root');
let main = document.querySelector('main');
let deck = document.querySelector('.deck');

function cardElement() {
	let svg = document.createElement("img");
	svg.src = "cards/back.svg";
	return svg;
}

deck.append(...Array.from({length: 40}, cardElement));

function setColumns(columns) {
	root.style.setProperty('--columns', columns);
}

let lastId = 0;

function resizeDeck() {
	const id = lastId = (lastId + 1) % Number.MAX_SAFE_INTEGER;
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			if (id == lastId) {
				let columns = 4;
				setColumns(columns);

				while(main.scrollHeight > main.clientHeight)
					setColumns(++columns);
			}
		});
	});
};

document.querySelector('img').addEventListener('load', resizeDeck, {once: true});
new ResizeObserver(resizeDeck).observe(main);

function* cardGenerator() {
	for (let suit of ["club", "diamond", "heart", "spade"]) {
		for (let number = 1; number <= 10; number++)
			yield {number, suit};
	}
}

let cards = [...cardGenerator()];

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
	for (let card of toTurn) {
		card.element.src = "cards/back.svg";
		card.isUp = false;
	}
	
	toTurn = [];
}

function pick(card) {
	if (card.isUp)
		return;
	
	card.element.src = card.url;
	card.isUp = true;
	
	if (picked) {
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
	card.url = `cards/${card.suit}${card.number}.svg`;
	card.element = deck.children[i];
	card.element.addEventListener('click', () => pick(card));
}

cards.forEach(card => fetch(card.url, {cache: "no-cache", priority: "low"}));
