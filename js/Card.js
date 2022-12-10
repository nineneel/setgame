import AI from "./AI.js";

export default class Card {
    static setBoard = document.querySelector(".set-board");
    static boardPos = Card.setBoard.getBoundingClientRect();

    static boardWidth = Card.boardPos.width;
    static boardHeight = Card.boardPos.height;

    static cardWidth = Card.boardWidth / 3 - 2;
    static cardHeight = Card.boardHeight / 4 - 1;

    constructor(number, shading, color, shape) {
        this.number = number;
        this.shading = shading;
        this.color = color;
        this.shape = shape;
    }

    generateCard() {
        const attr = [];
        attr[0] = this.number;
        attr[1] = this.shading;
        attr[2] = this.color;
        attr[3] = this.shape;

        let num = parseInt(attr[0]);
        let shading =
            attr[1] == "1" ? "solid" : attr[1] == "2" ? "striped" : "open";
        let color =
            attr[2] == "1" ? "#EB3D3D" : attr[2] == "2" ? "#2D8E5A" : "#D8D33D";
        let shape =
            attr[3] == "1" ? "oval" : attr[3] == "2" ? "squiggle" : "diamond";

        const mask1 = `<use href="#${shape}" fill="${
            shading == "open" ? "transparent" : color
        }"  ${shading == "striped" ? 'mask="url(#mask-stripe)"' : ""} ></use>`;
        const mask2 = `<use href="#${shape}" stroke="${color}" fill="none" stroke-width="18"></use>`;

        const svg =
            '<svg class="jss81" width="35" height="70" viewBox="0 0 200 400" style=" transition: width 0.5s ease 0s, height 0.5s ease 0s;">' +
            mask1 +
            mask2 +
            "</svg>";
        let new_card = svg;

        for (let i = 0; i < num; i++) {
            new_card += svg;
        }

        // mengembalikan Node HTML
        return new_card;
    }
}
