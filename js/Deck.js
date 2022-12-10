import Card from "./Card.js";

export default class Deck {
    constructor() {
        this.cards = [];
    }

    generateDeck() {
        let deck = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        deck.push(`${i}${j}${k}${l}`);
                    }
                }
            }
        }

        // Random the deck using Fisher-Yates
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }

        Deck.saveDeck(deck);
        Deck.savePlayerScore(0);

        this.cards = deck;
    }

    generateDeckWithCard() {
        const deck = this.cards;

        const setBoard = document.querySelector(".set-board");

        for (let i = 0; i < deck.length; i++) {
            let card = new Card(deck[i][0], deck[i][1], deck[i][2], deck[i][3]);
            const wrapper = `<div class="invisible opacity-0 absolute transition duration-500 p-2 translate-y-[${
                Card.boardHeight / 2 - Card.cardHeight / 2
            }px] -translate-x-[${Card.cardWidth}px] w-[${
                Card.cardWidth
            }px] h-[${
                Card.cardHeight
            }px] flex justify-center items-center" data-card="${
                deck[i]
            }"><div class="flex gap-2 w-full h-full justify-center items-center border-2 border-slate-900 rounded-lg bg-white cursor-pointer hover:bg-neutral-300" >${card.generateCard()}</div></div>`;

            setBoard.innerHTML += wrapper;
        }
    }

    static saveDeck(deck) {
        localStorage.setItem("deck", JSON.stringify(deck));
    }

    static loadDeck() {
        return JSON.parse(localStorage.getItem("deck"));
    }

    static savePlayerScore(point) {
        localStorage.setItem("playerScore", point);
    }

    static loadPlayerScore() {
        return localStorage.getItem("playerScore");
    }

    static saveComputerScore(point) {
        localStorage.setItem("computerScore", point);
    }

    static loadComputerScore() {
        return localStorage.getItem("computerScore");
    }
}
