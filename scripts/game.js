class Tile {
    constructor(letter, score) {
        this.jq = $("<img>").attr("src", `res/img/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`);
        this.jq.attr("height", "90px").attr("width", "82px");
        this.jq.data("letter", letter).data("score", score);
        this.jq.addClass("tile");
        if (letter === "BLANK") {
            let dialog = $("<div>");
            let tiles = $("<table>").addClass("tileTable");
            let row = $("<tr>");
            let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (let i = 0; i < alpha.length; i++) {
                if (i === 9 || i === 18) {
                    tiles.append(row);
                    row = $("<tr>");
                }
                let cell = $("<td>").attr("colspan", 2).append($("<img>").attr("src", `res/img/Scrabble_Tiles/Scrabble_Tile_${alpha[i]}.jpg`).attr("height", "68px").attr("width", "62px"));
                cell.data("letter", alpha[i]);
                cell.on("click", () => {
                    $(".blankMenuSelected").removeClass("blankMenuSelected");
                    cell.addClass("blankMenuSelected");
                })
                row.append(cell);
                cell.addClass("blankMenu");
            }
            row.prepend($("<td>")).append("<td>");
            tiles.append(row);
            dialog.append(tiles);
            this.dialog = dialog.dialog({
                height: "auto",
                width: "auto",
                autoOpen: false,
                modal: true,
                buttons: [
                    {
                        text: "OK",
                        click: () => {
                            this.dialog.dialog("close");
                        }
                    }
                ],
                beforeClose: () => {
                    if ($(".blankMenuSelected").length) {
                        let selectedLetter = $(".blankMenuSelected").data("letter");
                        this.jq.attr("src", `res/img/Scrabble_Tiles/Scrabble_Tile_${selectedLetter}.jpg`).addClass("blankSelected");
                        this.jq.data("selectedLetter", selectedLetter);
                        return true;
                    }
                    else {
                        alert("Please pick a letter for the blank tile!");
                    }
                    return false;
                }
            });
            this.jq.on("dblclick", () => {
                this.dialog.dialog("open");
            })
        }
    }
}


class GameSquare {
    constructor(multiplier, row, col) {
        this.jq = $("<td>").addClass("gamesquare").droppable({
            tolerance: "pointer",
            accept: ".tile"
        });
        this.jq.data("row", row).data("col", col).data("multiplier", multiplier.amount).data("multType", multiplier.type);
    }
}

class GameBoard {
    constructor() {
        this.board = new Array(15);
        this.jq = $("<table>").addClass("gameboard");
        this.jqRow = $("<tr>");
        for (let i = 0; i < this.board.length; i++) {
            let multiplier = { amount: 1, type: "N" };
            this.board[i] = new GameSquare(multiplier, 0, i);
            if (i === 4 || i === 10) {
                multiplier = { amount: 2, type: "W" };
                this.board[i] = new GameSquare(multiplier, 0, i);
                this.board[i].jq.addClass("doubleword").append($("<span>").text("Double Word"));
            }

            this.jqRow.append(this.board[i].jq);
        }
        this.jq.append(this.jqRow);
    }

    isEmpty() {
        let isEmpty = true;
        this.board.forEach(element => {
            if (element.jq.find("img").length) isEmpty = false;
        })
        return isEmpty;
    }

    updateValidSquares() {
        if (this.isEmpty()) {
            this.board.forEach(element => {
                element.jq.droppable("enable");
            })
        }
        else {
            for (let i = 0; i < this.board.length; i++) {
                if (i === 0) {
                    if (this.board[i].jq.find("img").length || !this.board[i + 1].jq.find("img").length)
                        this.board[i].jq.droppable("disable");
                    else
                        this.board[i].jq.droppable("enable");
                }
                else if (i === this.board.length - 1) {
                    if (this.board[i].jq.find("img").length || !this.board[i - 1].jq.find("img").length)
                        this.board[i].jq.droppable("disable");
                    else
                        this.board[i].jq.droppable("enable");
                }
                else {
                    if (this.board[i].jq.find("img").length || (!this.board[i + 1].jq.find("img").length && !this.board[i - 1].jq.find("img").length))
                        this.board[i].jq.droppable("disable");
                    else
                        this.board[i].jq.droppable("enable");
                }
            }
        }
    }

    checkValidity(lcDOM, scDOM, sButton) {
        let count = 0;
        let start = -1;
        let end = -1;
        let score = 0;
        let multiplier = 1;
        let word = "";
        let blanks = [];
        this.board.forEach(element => {
            let index = this.board.indexOf(element);
            let tile = element.jq.find("img")
            if (tile.length) {
                if (start === -1) {
                    start = index;
                }
                if (element.jq.data("multiplier")) {
                    multiplier *= element.jq.data("multiplier");
                }
                score += tile.data("score");
                let letter = tile.data("letter");
                if (letter === "BLANK"){
                    letter = tile.data("selectedLetter");
                    blanks.push(index);
                }
                word += letter;
                count++;
                end = index;
            }
        })
        if (multiplier) score *= multiplier;
        let valid = {
            start: start,
            end: end,
            count: count
        };
        if (valid.count === 1)
            lcDOM.show();
        else
            lcDOM.hide();
        if (valid.end - valid.start + 1 > valid.count && valid.count > 0)
            scDOM.show()
        else
            scDOM.hide();
        if (!(scDOM.is(":visible") || lcDOM.is(":visible")))
            sButton.prop("disabled", false);
        else
            sButton.prop("disabled", true);
        return [score, word, blanks];
    }
}

class TileRack {
    constructor() {
        this.rackTiles = [];
        this.jq = $("<div>").attr("id", "tilerack");
        this.jq.droppable({
            tolerance: "pointer",
            accept: ".tile"
        });
    }
    removeTile(letter) {
        let removed = false;
        this.rackTiles.every(element => {
            if (element.jq.data("letter") === letter) {
                let index = this.rackTiles.indexOf(element);
                this.rackTiles.splice(index, 1);
                removed = element;
                return false;
            }
            return true;
        });
        return removed;
    }

    addTile(tile) {
        this.rackTiles.push(tile);
        this.jq.append(tile.jq)
    }

    count() {
        return this.rackTiles.length;
    }
}

class TileBag {
    constructor() {
        this.bag = [
            { "letter": "A", "value": 1, "amount": 9 },
            { "letter": "B", "value": 3, "amount": 2 },
            { "letter": "C", "value": 3, "amount": 2 },
            { "letter": "D", "value": 2, "amount": 4 },
            { "letter": "E", "value": 1, "amount": 12 },
            { "letter": "F", "value": 4, "amount": 2 },
            { "letter": "G", "value": 2, "amount": 3 },
            { "letter": "H", "value": 4, "amount": 2 },
            { "letter": "I", "value": 1, "amount": 9 },
            { "letter": "J", "value": 8, "amount": 1 },
            { "letter": "K", "value": 5, "amount": 1 },
            { "letter": "L", "value": 1, "amount": 4 },
            { "letter": "M", "value": 3, "amount": 2 },
            { "letter": "N", "value": 1, "amount": 6 },
            { "letter": "O", "value": 1, "amount": 8 },
            { "letter": "P", "value": 3, "amount": 2 },
            { "letter": "Q", "value": 10, "amount": 1 },
            { "letter": "R", "value": 1, "amount": 6 },
            { "letter": "S", "value": 1, "amount": 4 },
            { "letter": "T", "value": 1, "amount": 6 },
            { "letter": "U", "value": 1, "amount": 4 },
            { "letter": "V", "value": 4, "amount": 2 },
            { "letter": "W", "value": 4, "amount": 2 },
            { "letter": "X", "value": 8, "amount": 1 },
            { "letter": "Y", "value": 4, "amount": 2 },
            { "letter": "Z", "value": 10, "amount": 1 },
            { "letter": "BLANK", "value": 0, "amount": 2 }
        ]
    }

    totalRemaining() {
        let sum = 0;
        this.bag.forEach(element => {
            sum += element.amount;
        })

        return sum;
    }

    remaining(letter) {
        this.bag.forEach(element => {
            if (element.letter === letter)
                return element.amount;
        })
    }

    draw() {
        let tile = false;
        if (this.totalRemaining() > 0) {
            let rand = Math.floor(Math.random() * this.totalRemaining()) + 1;
            let current = 0;
            this.bag.every(element => {
                current += element.amount;
                if (current >= rand) {
                    element.amount--;
                    tile = new Tile(element.letter, element.value);
                    return false;
                }
                return true;
            })
        }
        return tile;
    }

    exchange(tile) {
        let newTile = this.draw();
        if (newTile) {
            this.bag.forEach(element => {
                if (tile.match(element.letter)) {
                    element.amount++;
                }
            });
        }
        return newTile;
    }
}

class Turn {
    constructor(tilerack, tilebag, lengthCheckDOM, dictCheckDOM, spaceCheckDOM, submitButton) {
        this.gb = new GameBoard();
        this.lcDOM = lengthCheckDOM;
        this.dcDOM = dictCheckDOM;
        this.scDOM = spaceCheckDOM;
        this.sButton = submitButton;
        this.tr = tilerack;
        this.tb = tilebag;
        this.score = 0;
        this.word = "";

        this.gb.board.forEach(element => {
            element.jq.on("drop", (event, ui) => {
                ui.draggable.detach().appendTo(element.jq);
                ui.draggable.css({ "left": "0", "top": "0", "z-index": "1" });
                if (ui.draggable.data("letter") === "BLANK" && !ui.draggable.hasClass("blankSelected")) {
                    ui.draggable.trigger("dblclick");
                }
                this.gb.updateValidSquares();
                this.gb.checkValidity(this.lcDOM, this.scDOM, this.sButton);

            })
        })

        //unbind old drop handler from tile rack, rebind new drop handler with current turn's GameBoard
        this.tr.jq.off("drop").on("drop", (event, ui) => {
            ui.draggable.detach().appendTo(this.tr.jq);
            ui.draggable.css({ "left": "", "top": "" });
            this.gb.updateValidSquares();
            this.gb.checkValidity(this.lcDOM, this.scDOM, this.sButton);
        });
    }
    addTiles() {
        while (this.tr.count() < 7 && this.tb.totalRemaining() > 0) {
            this.tr.addTile(this.tb.draw());
        }
        this.tr.rackTiles.forEach(element => {
            element.jq.draggable({
                revert: "invalid",
                snap: ".gamesquare",
                snapMode: "inner",
                zindex: 1000
            });
        })
    }

    render(parent) {
        let old = parent.find("#board");
        if(old.length) old.remove();
        let board = $("<div>").attr("id", "board");
        board.append(this.gb.jq);
        parent.append(board);
        parent.append(this.tr.jq);
    }

    recall() {
        this.gb.board.forEach(element => {
            let tile = element.jq.find("img");
            if (tile.length) {
                tile.detach().appendTo(this.tr.jq);
            }
        });
        this.gb.updateValidSquares();
        this.gb.checkValidity(this.lcDOM, this.scDOM, this.sButton);
    }

    submit() {
        let valid = this.gb.checkValidity(this.lcDOM, this.scDOM, this.sButton);
        console.log(valid);
        this.score = valid[0];
        this.word = valid[1];
        for (let i = 0; i < this.word.length; i++) {
            if(!valid[2].includes(i))
                this.tr.removeTile(this.word[i]);
        }
        valid[2].forEach(element =>{
            this.tr.removeTile("BLANK");
        })
        console.log(this.score);
        return !this.sButton.prop("disabled");
    }
}

class Game {
    constructor(lengthCheckDOM, dictCheckDOM, spaceCheckDOM, submitButton, gameArea) {
        this.lcDOM = lengthCheckDOM;
        this.dcDOM = dictCheckDOM;
        this.scDOM = spaceCheckDOM;
        this.sButton = submitButton;
        this.ga = gameArea;
        this.tr = new TileRack();
        this.tb = new TileBag();
        this.turns = [];
        this.totalScore = 0;
        this.currentTurn;
    }

    start() {
        this.currentTurn = new Turn(this.tr, this.tb, this.lcDOM, this.dcDOM, this.scDOM, this.sButton);
        this.currentTurn.addTiles();
        this.currentTurn.render(this.ga);
    }

    nextTurn() {
        if (this.currentTurn.submit()) {
            this.turns.push(this.currentTurn);
            this.totalScore += this.currentTurn.score;
            this.currentTurn = new Turn(this.tr, this.tb, this.lcDOM, this.dcDOM, this.scDOM, this.sButton);
            this.currentTurn.addTiles();
            this.currentTurn.render(this.ga);
            if(this.tr.count < 2){
                alert("Game Over!");
                this.sButton.prop("disabled", true);
            }
        }
        else
            alert("Something went wrong!");
    }
}