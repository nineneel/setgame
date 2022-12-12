import Card from "./Card.js";
import Deck from "./Deck.js";
import AI from "./AI.js";

export default class Play {
    constructor() {
        this.SET = [];
        this.AI_SET = [];
        this.in_board = [];
        this.is_computer_think = false;
        this.is_expand = false;
        this.is_game_over = false;

        // generate player score
        this.player_score = document.querySelector("#player-score");
        this.player_score.innerHTML = 0;

        // generate ai score
        this.computer_score = document.querySelector("#computer-score");
        this.computer_score.innerHTML = 0;

        this.ai = new AI();

        // generate new deck
        this.main_deck = new Deck();
        this.initial();
    }

    initial() {
        // when deck on local storage is empty generate new deck else use is it
        if (Deck.loadDeck()) {
            this.main_deck.cards = Deck.loadDeck();
            this.player_score.innerHTML = Deck.loadPlayerScore();
            this.computer_score.innerHTML = Deck.loadComputerScore();
        } else {
            this.main_deck.generateDeck();
        }

        this.main_deck.generateDeckWithCard();

        this.deck = this.main_deck.cards;

        this.addClickListener();

        this.addMenu();

        this.showCards(this.main_deck, this.is_expand);
    }

    checkSet(isPlayer, THE_SET) {
        if (!isPlayer) {
            if (this.in_board.includes(THE_SET[2]) && this.isSet(THE_SET)) {
                this.setFound(false, this.AI_SET); // computer
            } else {
                this.AI_SET = [];

                if (!this.is_computer_think) {
                    this.aiThinking();
                }
            }
            this.computerClicked(THE_SET[0]);
            this.computerClicked(THE_SET[1]);
            // this.computerClicked(THE_SET[2]);
        } else {
            if (THE_SET.length == 3) {
                if (this.isSet(THE_SET)) {
                    this.setFound(true, this.SET); // player
                } else {
                    // set is not a SET!
                    THE_SET.forEach((el) => {
                        const card = document.querySelector(
                            `[data-card="${el}"]`
                        ).firstChild;
                        this.cardClicked(card);
                    });
                    this.SET = [];
                }
            }
        }
    }

    isSet(cards) {
        // check every element if two of them is same
        // and the other one is different then return false
        // other way, return true
        for (let i = 0; i < 4; i++) {
            if (!(cards[0][i] == cards[1][i] && cards[1][i] == cards[2][i])) {
                if (
                    !(
                        cards[0][i] != cards[1][i] &&
                        cards[1][i] != cards[2][i] &&
                        cards[0][i] != cards[2][i]
                    )
                )
                    return false;
            }
        }

        return true;
    }

    setFound(isPlayer, THE_SET) {
        isPlayer
            ? Deck.savePlayerScore(++this.player_score.innerHTML)
            : Deck.saveComputerScore(++this.computer_score.innerHTML);

        for (let i = 0; i < 3; i++) {
            // move card to invisible
            let card = document.querySelector(`[data-card="${THE_SET[i]}"]`);
            card.style.transform = `translate(${Card.boardWidth}px, ${
                Card.boardHeight / 2 - Card.cardHeight / 2
            }px)`;
            card.classList.add("opacity-0");
            setTimeout(() => {
                card.classList.add("invisible");
            }, 400);
        }

        // then remove 3 card from deck
        isPlayer ? this.removeCard(this.SET) : this.removeCard(this.AI_SET);

        // if expand is true then make it false
        if (this.is_expand) {
            this.reduceBoard();
            this.is_expand = false;
        }

        // notify ai if set has been found
        this.ai.isSetFound();

        // reset set
        this.SET = [];
        this.AI_SET = [];

        Deck.saveDeck(this.deck);

        this.showCards(this.main_deck, this.is_expand);
    }

    cardClicked(card) {
        // change the background color of the card
        card.classList.toggle("bg-neutral-200");

        // set focus atribute to true / false
        card.setAttribute(
            "focus",
            card.getAttribute("focus") == "true" ? false : true
        );
    }

    removeCard(THE_SET) {
        // swap last 3 card to 3 set card
        let end = this.is_expand ? 15 : this.deck.length;

        if (this.is_expand) {
            for (let i = 1; i <= 3; i++) {
                // 1. remove from back
                // 2. check if the current card is in the last 3 card just remove it, if not swap it to the last 3 card
                if (this.isSwapAble(this.deck, THE_SET[i - 1])) {
                    let temp = this.deck[this.deck.indexOf(THE_SET[i - 1])];
                    this.deck[this.deck.indexOf(THE_SET[i - 1])] =
                        this.deck[end - i];
                    this.deck[end - i] = temp;
                }
            }
        } else {
            for (let i = 1; i <= 3; i++) {
                let temp = this.deck[this.deck.indexOf(THE_SET[i - 1])];
                this.deck[this.deck.indexOf(THE_SET[i - 1])] =
                    this.deck[end - i];
                this.deck[end - i] = temp;
            }
        }

        // remove last 3 deck
        for (let i = 1; i <= 3; i++) {
            this.deck.splice(this.deck.indexOf(this.deck[end - i]), 1);
        }
    }

    showCards() {
        const deck = this.main_deck.cards;
        // get the deck
        // add card from index 1 to 12
        // if card on the deck less than 12
        let pos = 0,
            boardRow = 4;

        if (this.is_expand) {
            boardRow = 5;
        }

        if (deck.length < 12) {
            boardRow = deck.length / 3;
        }

        let in_board = [];

        for (let i = 0; i < boardRow; i++) {
            for (let j = 0; j < 3; j++) {
                in_board[i * 3 + j] = deck[pos];
                let card = document.querySelector(
                    `[data-card="${deck[pos++]}"]`
                );
                card.classList.remove("invisible");
                card.classList.add("opacity-100");
                card.style.transform = `translate(${Card.cardWidth * j}px, ${
                    Card.cardHeight * i
                }px)`;
            }
        }

        this.in_board = in_board;

        this.gameOver();

        if (this.is_game_over) {
            console.log("game is over");
            const resetBtn = document.querySelector("#reset-game");
            resetBtn.innerHTML = "Play Again";
            const playerScore = parseInt(this.player_score.innerHTML);
            const computerScore = parseInt(this.computer_score.innerHTML);
            const winner =
                playerScore == computerScore
                    ? "Draw"
                    : playerScore < computerScore
                    ? "Computer Win!"
                    : "Player Win!";
            const gameOverBoard = `<div
            class="absolute w-full h-full flex justify-center items-center bg-sky-500/30 font-bold text-center "
        >
        <div class="w-full py-5 m-10 rounded-md bg-sky-500  text-white uppercase">
        ${winner}
            <br/>
            game is over
             </div>
        </div>`;
            Card.setBoard.innerHTML += gameOverBoard;
            return;
        }

        // if (!ai.isThinking) {
        let real_set = this.ai.findSet(this.in_board);
        // let ai_set = this.ai.thinking() ?? [];

        if (real_set == null) {
            this.expandBoard();
        }

        if (!this.is_computer_think) {
            this.aiThinking();
        }
    }

    async aiThinking() {
        this.is_computer_think = true;
        // const hasil = await this.ai.thinking();
        let AI_SET = [];

        AI_SET[0] = await this.ai.firstCard(this.in_board);
        this.computerClicked(AI_SET[0]);

        AI_SET[1] = await this.ai.secondCard(this.in_board, AI_SET[0]);
        this.computerClicked(AI_SET[1]);

        AI_SET[2] = await this.ai.thirdCard(AI_SET).finally(() => {
            this.ai.timeToThink().finally(() => {
                this.AI_SET = AI_SET;

                this.is_computer_think = false;
                this.checkSet(false, this.AI_SET);
            });
        });
    }

    computerClicked(attr) {
        if (this.in_board.includes(attr)) {
            const card = document.querySelector(
                `[data-card="${attr}"]`
            ).firstChild;

            // change the ring color of the card
            card.classList.toggle("ring-offset-2");
            card.classList.toggle("ring-2");
        }
    }

    addClickListener() {
        const deck = this.deck;

        deck.forEach((el) => {
            const card = document.querySelector(
                `[data-card="${el}"]`
            ).firstChild;
            card.addEventListener("click", () => {
                // // run card click function
                this.cardClicked(card);
                // // if focus is true then add the card to set candidate
                // // else remove it from set candidate
                if (card.getAttribute("focus") == "true") this.SET.push(el);
                else this.SET.splice(this.SET.indexOf(el), 1);
                // // run set found function
                this.checkSet(true, this.SET);
            });
        });
    }

    // Expand board
    isSwapAble(cards, card) {
        for (let i = 0; i < 3; i++) {
            if (card == cards[12 + i]) {
                return false;
            }
        }
        return true;
    }

    expandBoard() {
        // height of board add by card height
        if (!this.is_expand) {
            Card.setBoard.classList.add(`h-[${450 + Card.cardHeight}px]`);
            Card.setBoard.style.transition = "height 0.5s ease 0s";
        }

        // call showcard function
        this.is_expand = true;
        this.showCards(this.main_deck);
    }

    reduceBoard() {
        Card.setBoard.classList.remove(`h-[${450 + Card.cardHeight}px]`);
        Card.setBoard.style.transition = "height 0.5s ease 0s";
    }

    addMenu() {
        // there no set setting
        const noSetBtn = document.querySelector("#nosets");

        // reset game
        const resetBtn = document.querySelector("#reset-game");

        // noSetBtn.addEventListener("click", () => {
        //     if (this.deck.length > 12) {
        //         this.expandBoard();
        //     }
        // });

        resetBtn.addEventListener("click", () => {
            this.resetGame();
        });
    }

    gameOver() {
        let real_set = this.ai.findSet(this.in_board);
        if (this.deck.length <= 12 && real_set == null) {
            this.is_game_over = true;
        }
    }

    resetGame() {
        this.is_game_over = false;
        localStorage.removeItem("deck");
        Deck.savePlayerScore(this.player_score.innerHTML);
        Deck.saveComputerScore(this.computer_score.innerHTML);
        window.location.reload();
    }
}
