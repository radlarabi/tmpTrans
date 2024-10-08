
let connection;
let canvas, ctx;
let player, opponent, ball;
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
};


function initCanvas() {
    console.log("testing");
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }
    ctx = canvas.getContext('2d');
    resizeCanvas(); 
    window.addEventListener('resize', resizeCanvas);
}



function initPlayers() {
    if (!canvas) return;  

    const playerWidth = canvas.width * 0.02;
    const playerHeight = canvas.height * 0.15;
    player = {
        x: canvas.width * 0.02,
        y: (canvas.height - playerHeight) / 2,
        width: playerWidth,
        height: playerHeight,
        color: "#E6FF94",
        username: "player1",
        alias: "Player 1",
        score: 0,
        keys: keys,
    };

    opponent = {
        x: canvas.width - playerWidth - (canvas.width * 0.02),
        y: (canvas.height - playerHeight) / 2,
        width: playerWidth,
        height: playerHeight,
        color: "#FF6347", 
        username: "opponent",
        alias: "Player 2",
        score: 0,
        keys: keys,
    };
}


function initBall() {
    if (!canvas) return;  
    const ballSize = canvas.width * 0.01;
    ball = {
        x: (canvas.width - ballSize) / 2,
        y: (canvas.height - ballSize) / 2,
        size: ballSize,
        color: "#FFFFFF",
        velocity_x: 5, 
        velocity_y: 5  
    };
}


function resizeCanvas() {
    if (!canvas) return; 
    console.log("resezing");
    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.6;

    if (player) {
        player.width = canvas.width * 0.02;
        player.height = canvas.height * 0.15;
        player.x = canvas.width * 0.02;
        player.y = (canvas.height - player.height) / 2;
    }

    if (opponent) {
        opponent.width = canvas.width * 0.02;
        opponent.height = canvas.height * 0.15;
        opponent.x = canvas.width - opponent.width - (canvas.width * 0.02);
        opponent.y = (canvas.height - opponent.height) / 2;
    }

    if (ball) {
        ball.size = canvas.width * 0.01;
        ball.x = (canvas.width - ball.size) / 2;
        ball.y = (canvas.height - ball.size) / 2;
    }

    if (player && opponent && ball && canvas) {
        connection.send(JSON.stringify({
            event: 'resize',
            player: player,
            opponent: opponent,
            ball: ball,
            canvas: {
                width: canvas.width,
                height: canvas.height,
            }
        }));
    }

    drawGame();
}

function drawGame() {
    if (!ctx) return; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (player) {
        drawRect(player.x, player.y, player.width, player.height, player.color);
    }
    if (opponent) {
        drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color);
    }
    if (ball) {
        drawCircle(ball.x, ball.y, ball.size, ball.color);
    }
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}


function connectToServer(gameId) {
    connection = new WebSocket('ws://' + window.location.hostname + ':8001/ws/local/' + gameId + '/');

    connection.onopen = function () {
        if (player && opponent && ball && canvas) {
            console.log("send")
            connection.send(JSON.stringify({
                event: 'normal',
                player: player,
                opponent: opponent,
                ball: ball,
                canvas: {
                    width: canvas.width,
                    height: canvas.height,
                }
            }));
        }
    };

    connection.onmessage = function (e) {
        const data = JSON.parse(e.data);
        updateGame(data);
        if (data.event === 'game_over') {
            document.getElementById("gameOverMessage").textContent = data.message;
            document.getElementById("playerScore").textContent = data.player.score;
            document.getElementById("opponentScore").textContent = data.opponent.score;
            const modal = document.getElementById("gameOverModal");
            modal.style.display = "block";
            
        }
        console.log(data);
    };
}


// function updateGame(data) {
    
//     drawGame();
// }

let dirication ;

function initKeyHandlers() {
    window.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp"){ 
            keys.ArrowUp = true ;
            dirication = 'left';
        };
        if (event.key === "ArrowDown") {
            keys.ArrowDown = true;
            dirication = 'left';
        }
        if (event.key === "w") {
            keys.w = true;
            dirication = 'right';
        }
        if (event.key === "s") {
            keys.s = true;
            dirication = 'right';
        }

        sendMovementUpdate();
    });

    window.addEventListener("keyup", function (event) {
        if (event.key === "ArrowUp") keys.ArrowUp = false;
        if (event.key === "ArrowDown") keys.ArrowDown = false;
        if (event.key === "w") keys.w = false;
        if (event.key === "s") keys.s = false;

        sendMovementUpdate();
    });
}


function sendMovementUpdate() {
    if (player && opponent && ball && canvas && connection) {
        console.log(dirication);
        connection.send(JSON.stringify({
            event: 'move',
            player: player,
            opponent: opponent,
            dirication:dirication,
            ball: ball,
            canvas: {
                width: canvas.width,
                height: canvas.height,
            }
        }));
    }
}

function updateGame(data) {
    // Update the player and opponent positions
    if (data.player) {
        player.y = data.player.y;
    }
    if (data.opponent) {
        opponent.y = data.opponent.y;
    }
    // Update ball and canvas if necessary
    if (data.ball) {
        ball.x = data.ball.x;
        ball.y = data.ball.y;
    }
    if (data.canvas) {
        canvas.width = data.canvas.width;
        canvas.height = data.canvas.height;
    }
    
    player.score = data.player.score;
    opponent.score = data.opponent.score;
    // opponent.score = data.scores.opponent;
    // console.log(data.player.score);
    document.querySelector("#player1 .score").textContent =  opponent.score;
    document.querySelector("#player2 .score").textContent =   player.score;
    drawGame(); 
}





function startGame() {
    initCanvas();
    initPlayers();
    initBall();
    initKeyHandlers();
    drawGame();
    
    const gameId = "game123";  
    connectToServer(gameId);
}


function displayGame() {
    const section = document.querySelector(".box");
    const infoPlayers = document.querySelector(".infoPlayers");
    let gameCanvas = document.getElementById("gameCanvas");
    if (section) {
        const display = document.getElementsByClassName("playerInfo");
        for (let i = 0; i < display.length; i++) {
            display[i].classList.add('display');
        }
        section.style.display = 'none';
        gameCanvas.style.display = 'block';
        infoPlayers.classList.add('display');
        gameCanvas.classList.add('block-1');
        console.log("start game");
        startGame();
    }
}


// document.getElementById("start-game").addEventListener('click', function () {
//     displayGame();
// });




// -----------Game over ------------
document.addEventListener('click', (e) => {
    if (e.target.id === "restartButton") {
        document.getElementById("gameOverModal").style.display = "none";
        restartGame(); 
    }
})

// document.getElementById("restartButton").onclick = function() {
// }


function sendGameReset() {
    if (connection && connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify({ event: 'reset_game' }));
    }
}


function restartGame() {

    let gameId = "test123";
    sendGameReset();
    // connection.close();
    // connectToServer(gameId);  
    
}
