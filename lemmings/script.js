//
// this is an absolute hot mess
//

var lemmings = [];
var walls = [];
var lines = [];
var m = 20; // cell size
var gravity = 1.02;
var l = 0;
var ctx;

// 20 rows 30 columns
// 0 = space; 1 = wall; 2 = entrance; 3 = lava; 4 = dug; 5 = stopped
var level = [
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

var entrance = {
        x: 0 * m,
        y: 4 * m
    }

var stopped;

function drawLevelPlan() {
    ctx = game.canvas2.getContext("2d");

    ctx.clearRect(0, 0, game.canvas2.width, game.canvas2.height);

    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            if (level[i][j] == 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(j * m, i * m, m, m);
            } else if (level[i][j] == 2) {
                ctx.fillStyle = "brown";
                ctx.fillRect(j * m, i * m, m/2, m);
                entrance.x = j * m;
                entrance.y = i * m;
            } else if (level[i][j] == 3) {
                ctx.fillStyle = "red";
                ctx.fillRect(j * m, i * m, m, m);
            } else if (level[i][j] == 4) {
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                ctx.fillRect(j * m, i * m, m, m)
            }
        }
    }
}


function startGame() {
    game.start();
    addPieces();
    drawLevelPlan();
}

function addLemmings() {
    let i = 0;
    let adding = setInterval(() => {
        lemmings.push(new lemming(m*0.75, m, "green", entrance.x, entrance.y));

        if (++i == 5) {
            clearInterval(adding);
        }
    }, 1000)
}

function addPieces() {
    addLemmings();
}

/*class wall {
    constructor(w, h, color, x, y) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;

        this.update = function () {
            ctx = game.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
    }
}*/

class lemming {

    constructor(w, h, color, x, y) {

        this.width = w;
        this.height = h;
        this.color = color;
        this.x = x;
        this.y = y;

        this.walk = 1;

        this.isGrounded = false;
        this.isDead = false;
        this.isAction = false;
        this.isSelected = false;
        this.isStop = false;

        this.actionCount = m * 2;

        this.selected = function() {
            if (!this.isSelected) {
                this.isSelected = true;
                this.color = "yellow";
            }
            else {
                this.isSelected = false;
                this.color = "green";
            }
        }

        this.update = function () {
            ctx = game.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };

        this.newPos = function () {
            if (!this.isDead && !this.isStop) {
                if (!this.isAction ) {
                    var newx = this.walk + this.x;
                    this.x = newx;
    
                    if (!this.isGrounded) {
                        this.y *= gravity;
                    } else {
                        this.y = Math.round(this.y / 20) * 20;
                    }
                } else {
                    if (this.actionCount > 0) {
                        this.y = this.walk + this.y;
                        this.actionCount--;
                    } else {
                        this.actionCount = m * 2;
                        this.isAction = false;
                    }
                }
            }
        };

        this.collision = function () {
            let currentCell = level[Math.floor(this.y / 20)][Math.floor(this.x / 20)];
            let currentGround = level[Math.floor(this.y / 20) + 1][Math.floor(this.x / 20)];
            let nextCell = level[Math.floor(this.y / 20)][Math.floor(this.x / 20) + 1];

            if (!this.isDead && !this.isAction) {
                // check if grounded
                if (currentGround == 1) {
                    this.isGrounded = true;
                } else {
                    this.isGrounded = false;
                }

                // check for lava
                if (currentGround == 3) {
                    this.isDead = true;
                    this.height = h / 2;
                    this.y += h / 2;
                    this.width = w * 1.5;
                }

                // check for walls or stopped lemmings
                if (currentCell == 1 || nextCell == 1 ||
                    currentCell == 5 || nextCell == 5) {
                    return true;
                } else if (nextCell ) {

                } else {
                    return false;
                }
            }
        };

        this.dig = function() {
            this.isAction = true;
            level[Math.floor(this.y/20) + 1][Math.floor(this.x/20)] = 4;
            drawLevelPlan();
        }

        this.stop = function() {
            this.isStop = true;
            level[Math.floor(this.y/20)][Math.floor(this.x/20)] = 5;
            drawLevelPlan();
        }
    }
}

function updateGame() {
    game.clear();

    for (let i = 0; i < lemmings.length; i++) {
        if (lemmings[i].collision()) {
            lemmings[i].walk *= -1;
        }

        lemmings[i].newPos();
        lemmings[i].update();
    }

    /*for (let i = 0; i < walls.length; i++) {
        walls[i].update();
    }*/
}

var game = {
    canvas1: document.createElement("canvas"),
    canvas2: document.createElement("canvas"),
    start: function() {
        this.canvas1.setAttribute("id", "canvas1");
        this.canvas2.setAttribute("id", "canvas2");
        //this.canvas1.style.cursor = "none";
        this.context = this.canvas1.getContext("2d");
        document.body.insertBefore(this.canvas1, document.body.childNodes[0]);
        document.body.insertBefore(this.canvas2, document.body.childNodes[0]);
        resizeCanvasToDisplaySize(document.getElementById("canvas1"));
        resizeCanvasToDisplaySize(document.getElementById("canvas2"));
        this.interval = setInterval(updateGame, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
    }
}


function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

startGame();
addUI();

function addUI() {
    let dig = document.createElement('button');
    dig.innerHTML = "dig";
    dig.id = "dig";
    document.body.appendChild(dig);

    dig.addEventListener('click', (e) => {
        for (var i of lemmings) {
            if (i.isSelected) {
                i.dig();
            }
        }
    })

    let stop = document.createElement('button');
    stop.innerHTML = "stop";
    stop.id = "stop";
    document.body.appendChild(stop);

    stop.addEventListener('click', (e) => {
        for (var i of lemmings) {
            if (i.isSelected) {
                i.stop();
            }
        }
    })
}

document.getElementById("canvas2").addEventListener('click', (e) => {
    isLemmingPresent(Math.floor(e.offsetX/m), Math.floor(e.offsetY/m));
});

function isLemmingPresent(x, y) {
    for (var i of lemmings) {
        if (Math.round(i.x/m) == x && Math.round(i.y/m) == y) {
            i.selected();
            return;
        }
    }
}