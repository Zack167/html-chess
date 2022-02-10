function Box(id, column, row, pawn) {
    this.id = id;
    this.column = column; // x
    this.row = row; // y
    this.pawn = pawn;
    this.setPawn = function(pawn) {
        this.pawn = pawn;
    }
    this.getPosition = function() {
        return "(" + column + "," + row + ")";
    }
}

function Direction(xDir, yDir) {
    this.xDir = xDir;
    this.yDir = yDir;
    this.scalarProduct = function (direction, lambda) {
        return new Direction(direction.xDir * lambda, direction.yDir * lambda);
    }
}

function Pawn(color, imageURI, possibleDirections) {
    this.color = color;
    this.imageURI = imageURI;
    this.possibleDirections = possibleDirections;
    this.maxOffset = 2;
    this.firstMove = true;
    this.box = null;
    this.setBox = function(box) {
        this.box = box;
        this.box.setPawn(this);
    }
    this.move = function(box) {
        this.firstMove = false;
        this.maxOffset = 1;
        let enemyPawn = box.pawn;
        if (enemyPawn !== null) {

        }
        this.box = box;
    }
}

function Player(color) {
    this.color = color;
    this.pawns = new Map();
    this.addPawn = function(idPawn, pawn) {

    }
}

let board, whitePlayer, blackPlayer;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const BOX_WIDTH = 60;
const BOX_HEIGHT = 60;

function render(board) {
    var origin = document.getElementById("A1");

    board.forEach( function(box, idBox) {
        if (box.pawn !== null) {    
            var icon = document.createElement("img");
            icon.src = box.pawn.imageURI;
            icon.width = BOX_WIDTH;
            icon.height = BOX_HEIGHT;
            icon.classList.add("icon");
            icon.id = "icon-" + box.pawn.id;
            icon.style.position = "absolute";
            icon.style.bottom = (25 + (BOX_HEIGHT * box.row)) + "px";
            icon.style.left = (25 + (BOX_WIDTH * box.column)) + "px";
            origin.appendChild(icon);
        }
    })
}

function loadTable() {
    board = new Map();
    whitePlayer = new Player("white");
    blackPlayer = new Player("black");

    for (var rowInc = 0; rowInc < 8; rowInc++) {
        for (var colInc = 0; colInc < 8; colInc++) {
            let boxId = letters[colInc] + (rowInc+1);
            let box = new Box(boxId, colInc, rowInc, null);
            if (rowInc == 1) {
                let pawn = new Pawn("white", "img/white-pawn.png", new Direction(0, +1));
                let idPawn = "w-p" + colInc;
                whitePlayer.addPawn(idPawn, pawn);
                pawn.setBox(box);
            } else if (rowInc == 6) {
                let pawn = new Pawn("black", "img/black-pawn.png", new Direction(0, -1));
                let idPawn = "b-p" + colInc;
                blackPlayer.addPawn(idPawn, pawn);
                pawn.setBox(box);
            }
            board.set(boxId, box);
        }
    }

    render(board);
}