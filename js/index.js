class Box {
    constructor(id, column, row, pawn) {
        this.id = id;
        this.column = column; // x
        this.row = row; // y
        this.pawn = pawn;
    }

    setPawn = function(pawn) {
        this.pawn = pawn;
    }

    getPosition = function() {
        return letters[this.column] + (this.row + 1);
    }
}

class Direction {
    constructor(xDir, yDir) {
        this.xDir = xDir;
        this.yDir = yDir;
    }

    scalarProduct = function (lambda) {
        return new Direction(this.xDir * lambda, this.yDir * lambda);
    }

    sum = function (direction) {
        return new Direction(direction.xDir + this.xDir, direction.yDir + this.yDir);
    }
}

class Pawn {
    constructor(kind, color, imageURI, maxOffset, checkFirstMove, directions) {
        this.kind = kind;
        this.color = color;
        this.imageURI = imageURI;
        this.directions = directions;
        this.maxOffset = maxOffset;
        this.firstMove = checkFirstMove;
        this.box = null;
        this.id = null;
    }

    setId = function(id) {
        this.id = id;
    }

    setBox = function (box) {
        this.box = box;
        this.box.setPawn(this);
    }

    move = function (box) {
        this.firstMove = false;
        if (this.kind == "pawn") {
            this.maxOffset = 1;
        }
        let enemyPawn = box.pawn;
        if (enemyPawn !== null) {
            // eat enemy
        }
        this.box.setPawn(null);
        this.box = box;
        this.box.setPawn(this);
    }

    calculatePossibleBoxes = function() {
        console.log("Possible Directions for " + this.kind + " in " + this.box.getPosition());
        directionloop: for (var j = 0; j < this.directions.length; j += 1) {
            for (var i = 1; i <= this.maxOffset; i += 1) {
                let direction = this.directions[j];
                let actualX = this.box.column;
                let actualY = this.box.row;
                let position = new Direction(actualX, actualY).sum(direction.scalarProduct(i));
                if (position.xDir >= 0 && position.xDir < 8 && position.yDir >= 0 && position.yDir < 8) {
                    let boxId = letters[position.xDir] + (position.yDir+1);
                    let box = board.get(boxId);
                    if (box.pawn === null) {
                        console.log(boxId);
                    } else if (box.pawn.color !== this.color) {
                        console.log(boxId);
                        continue directionloop;
                    } else if (box.pawn.color === this.color) {
                        continue directionloop;
                    }
                }
                // let id = letters[position.yDir] + (position.xDir + 1);
            }
        }
    }
}

class Player {
    constructor(color) {
        this.color = color;
        this.pawns = new Map();
        this.enemyPawns = new Map();
    }

    addPawn = function (idPawn, pawn) {
        this.pawns.set(idPawn, pawn);
    }

    eatEnemyPawn = function (idPawn, pawn) {
        this.enemyPawns.set(idPawn, pawn);
    }
}

let board, players, pawnsInGame;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const UP = new Direction(0, +1);
const DOWN = new Direction(0, -1);
const LEFT = new Direction(-1, 0);
const RIGHT = new Direction(+1, 0);

let directions = new Map();
directions.set("tower", [UP, DOWN, LEFT, RIGHT]);
directions.set("bishop", [UP.sum(LEFT), UP.sum(RIGHT), DOWN.sum(LEFT), DOWN.sum(RIGHT)]);
directions.set("queen", directions.get("tower").concat(directions.get("bishop")));
directions.set("king", directions.get("queen"));
directions.set("horse", [
    UP.sum(UP).sum(LEFT), UP.sum(UP).sum(RIGHT),
    DOWN.sum(DOWN).sum(LEFT), DOWN.sum(DOWN).sum(RIGHT),
    LEFT.sum(LEFT).sum(UP), LEFT.sum(LEFT).sum(DOWN),
    RIGHT.sum(RIGHT).sum(UP), RIGHT.sum(RIGHT).sum(DOWN)]);

const BOX_WIDTH = 60;
const BOX_HEIGHT = 60;

function render() {
    var origin = document.getElementById("A1");

    while (origin.firstChild !== null) {
        origin.removeChild(origin.lastChild);
    }

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
            icon.style.zIndex = 20;
            icon.onclick = function(event) {
                let pawnId = this.id.substring("icon-".length, this.id.length);
                console.log(pawnId);
                let pawn = pawnsInGame.get(pawnId);
                pawn.calculatePossibleBoxes();
                //pawnsInGame.get
            };
            origin.appendChild(icon);
        }
    });
}

function loadBoard() {
    board = new Map();
    pawnsInGame = new Map();
    players = new Map();
    players.set("white", new Player("white"));
    players.set("black", new Player("black"));

    for (var rowInc = 0; rowInc < 8; rowInc++) {
        for (var colInc = 0; colInc < 8; colInc++) {
            let boxId = letters[colInc] + (rowInc+1);
            let box = new Box(boxId, colInc, rowInc, null);
            let color = rowInc == 6 || rowInc == 7 ? "black" : "white";
            let player = players.get(color);
            let pawn = null;

            if (rowInc == 1) {
                pawn = new Pawn("pawn", color, "img/" + color +"-pawn.png", 2, true, [UP]);
            } else if (rowInc == 6) {
                pawn = new Pawn("pawn", color, "img/" + color +"-pawn.png", 2, true, [DOWN]);
            } else if (rowInc == 0 || rowInc == 7) {
                if (colInc == 0 || colInc == 7) {
                    pawn = new Pawn("tower", color, "img/" + color + "-tower.png", 8, true, directions.get("tower"));
                } else if (colInc == 1 || colInc == 6) {
                    pawn = new Pawn("horse", color, "img/" + color + "-horse.png", 1, false, directions.get("horse"));
                } else if (colInc == 2 || colInc == 5) {
                    pawn = new Pawn("bishop", color, "img/" + color + "-bishop.png", 8, false, directions.get("bishop"));
                } else if (colInc == 3) {
                    pawn = new Pawn("king", color, "img/" + color + "-king.png", 1, true, directions.get("king"));
                } else {
                    pawn = new Pawn("queen", color, "img/" + color + "-queen.png", 8, false, directions.get("queen"));
                }
            }

            if (pawn !== null) {
                let pawnId = color.charAt(0) + "-" + pawn.kind.charAt(0) + colInc;
                pawn.setId(pawnId);
                pawn.setBox(box);
                pawnsInGame.set(pawnId, pawn);
                player.addPawn(pawnId, pawn);
            }

            board.set(boxId, box);
        }
    }

    render();
}

function reset() {
    loadBoard();
}