export default class AI {
    constructor() {
        this.board = [];
        this.ai_is_thinking = false;
        this.rand_el_ttl = 0;
        this.select_first_card = 0;
        this.is_found = false;
    }

    isSetFound() {
        this.select_first_card = 0;
    }

    getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    randomCard(cards_stack, cards_pos) {
        let pos = cards_pos[this.getRandomNumber(0, cards_pos.length)];
        return cards_stack[pos];
    }

    scanBoard(stack) {
        let element = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        for (let j = 0; j < stack.length; j++) {
            for (let i = 0; i < 4; i++) {
                for (let k = 0; k < 3; k++) {
                    if (parseInt(stack[j][i]) == k) {
                        element[i][k]++;
                    }
                }
            }
        }

        console.log(element);

        let max_elements = [];
        let index_of_elements = [];

        max_elements[0] = element[0].reduce(
            (a, b) => Math.max(a, b),
            -Infinity
        );
        index_of_elements[0] = element[0].indexOf(max_elements[0]);
        max_elements[1] = element[1].reduce(
            (a, b) => Math.max(a, b),
            -Infinity
        );
        index_of_elements[1] = element[1].indexOf(max_elements[1]);
        max_elements[2] = element[2].reduce(
            (a, b) => Math.max(a, b),
            -Infinity
        );
        index_of_elements[2] = element[2].indexOf(max_elements[2]);
        max_elements[3] = element[3].reduce(
            (a, b) => Math.max(a, b),
            -Infinity
        );
        index_of_elements[3] = element[3].indexOf(max_elements[3]);

        // ambil nilai yang paling tinggi dari semua elemen
        let max_element = max_elements.reduce(
            (a, b) => Math.max(a, b),
            -Infinity
        );

        let index_of_max_elemen = max_elements.indexOf(max_element);
        let index_of_attr = index_of_elements[index_of_max_elemen];

        let new_stack = stack.filter(
            (attr) => parseInt(attr[index_of_max_elemen]) == index_of_attr
        );

        return new_stack;
    }

    firstCard(in_board) {
        let stack = in_board;
        // jika telah memilih kartu pertama sebanyak 6 kali namun masih gagal menemukan set maka jangan lakukan scan board
        if (this.select_first_card++ < 6) {
            stack = this.scanBoard(in_board);
        }

        console.log("the Stack:", stack);

        return new Promise((resolve) => {
            let cards_pos = [];
            for (let i = 0; i < stack.length; i++) {
                cards_pos.push(i);
            }
            setTimeout(() => {
                const predict_card = this.randomCard(stack, cards_pos);
                resolve(predict_card);
                this.ai_is_thinking = true;
                console.log("predict card 1: ", predict_card);
            }, 300);
        });
    }

    secondCard(stack, card_one) {
        return new Promise((resolve) => {
            let cards_pos = [];
            let ran_el_off = false;
            if (this.rand_el_ttl++ > 5) {
                ran_el_off = true;
                this.rand_el_ttl = 0;
            }

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

            // find elemen di luar dari kartu
            if (ran_el_off) {
                for (let i = 0; i < stack.length; i++) {
                    if (
                        stack[i][ran_el] != card_one[ran_el] &&
                        stack[i] != card_one
                    ) {
                        cards_pos.push(i);
                    }
                }
            }

            setTimeout(() => {
                const predict_card = this.randomCard(stack, cards_pos);
                resolve(predict_card);
                console.log("predict card 2: ", predict_card);
            }, 400);
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
                this.ai_is_thinking = true;
                console.log("predict card 3: ", predict_card);
            }, (5 - timeToThink) * 1500);
        });
    }

    timeToThink() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("istirahat");
            }, 500);
        });
    }

    findSet(board) {
        this.board = board;
        let deck = this.board;
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
