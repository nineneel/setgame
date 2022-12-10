export default class AI {
    constructor() {
        this.board = [];
    }

    getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    randomCard(cards_stack, cards_pos) {
        if (cards_pos.length == 0)
            return cards_stack[this.getRandomNumber(0, cards_stack.length)];
        let pos = cards_pos[this.getRandomNumber(0, cards_pos.length)];
        return cards_stack[pos];
    }

    firstCard(stack) {
        return new Promise((resolve) => {
            let cards_pos = [];
            for (let i = 0; i < stack.length; i++) {
                cards_pos.push(i);
            }
            setTimeout(() => {
                const predict_card = this.randomCard(stack, cards_pos);
                resolve(predict_card);
                console.log("predict card 1: ", predict_card);
            }, 500);
        });
    }

    secondCard(stack, card_one) {
        return new Promise((resolve) => {
            let cards_pos = [];
            // random element
            let ran_el = this.getRandomNumber(0, 3);
            // filter the stack
            for (let i = 0; i < stack.length; i++) {
                if (
                    stack[i][ran_el] == card_one[ran_el] &&
                    stack[i] != card_one
                ) {
                    cards_pos.push(i);
                }
            }

            setTimeout(() => {
                const predict_card = this.randomCard(stack, cards_pos);
                resolve(predict_card);
                console.log("predict card 2: ", predict_card);
            }, 500);
        });
    }

    thirdCard(SET) {
        return new Promise((resolve) => {
            // check the same element
            let attr1 = SET[0][0] == SET[1][0];
            let attr2 = SET[0][1] == SET[1][1];
            let attr3 = SET[0][2] == SET[1][2];
            let attr4 = SET[0][3] == SET[1][3];

            let val1 = attr1
                ? SET[0][0]
                : parseInt(SET[0][0]) + parseInt(SET[1][0]) == 3
                ? "0"
                : parseInt(SET[0][0]) + parseInt(SET[1][0]) == 2
                ? "1"
                : "2";

            let val2 = attr2
                ? SET[0][1]
                : parseInt(SET[0][1]) + parseInt(SET[1][1]) == 3
                ? "0"
                : parseInt(SET[0][1]) + parseInt(SET[1][1]) == 2
                ? "1"
                : "2";

            let val3 = attr3
                ? SET[0][2]
                : parseInt(SET[0][2]) + parseInt(SET[1][2]) == 3
                ? "0"
                : parseInt(SET[0][2]) + parseInt(SET[1][2]) == 2
                ? "1"
                : "2";

            let val4 = attr4
                ? SET[0][3]
                : parseInt(SET[0][3]) + parseInt(SET[1][3]) == 3
                ? "0"
                : parseInt(SET[0][3]) + parseInt(SET[1][3]) == 2
                ? "1"
                : "2";

            let predict_card = val1 + val2 + val3 + val4;

            let timeToThink = attr1 + attr2 + attr3 + attr4;

            setTimeout(() => {
                resolve(predict_card);
                console.log("predict card 3: ", predict_card);
            }, (5 - timeToThink) * 500);
        });
    }

    timeToThink() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("istirahat");
            }, 100);
        });
    }

    findSet(board) {
        this.board = board;
        let deck = board;
        let try_set = [];
        for (let i = 0; i < deck.length; i++) {
            for (let j = 0; j < deck.length; j++) {
                for (let k = 0; k < deck.length; k++) {
                    try_set[0] = deck[i];
                    try_set[1] = deck[j];
                    try_set[2] = deck[k];
                    if (deck[i] != deck[j] && deck[j] != deck[k]) {
                        if (this.isSet(try_set)) {
                            console.log(
                                "position:",
                                [parseInt(i / 3), i % 3],
                                [parseInt(j / 3), j % 3],
                                [parseInt(k / 3), k % 3]
                            );
                            return try_set;
                        }
                    }
                }
            }
        }

        return null;
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
}
