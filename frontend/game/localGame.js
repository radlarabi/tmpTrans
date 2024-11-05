
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
}

function initPlayers(player1, player2) {
    if (!canvas) return;  

    const playerWidth = 15;
    const playerHeight = 85;
    player = {
        x: canvas.width * 0.02,
        y: (canvas.height - playerHeight) / 2,
        width: playerWidth,
        height: playerHeight,
        color: "#E6FF94",
        username: player1,
        alias: player1,
        score: 0,
        keys: keys,
    };
    console.log(player);
    opponent = {
        x: canvas.width - playerWidth - (canvas.width * 0.02),
        y: (canvas.height - playerHeight) / 2,
        width: playerWidth,
        height: playerHeight,
        color: "#FF6347", 
        username: player2,
        alias: player2,
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
    };
}

// let keys = { ArrowUp: false, ArrowDown: false, w: false, s: false };
let direction = ''; // To track which player is moving

function sendMovementUpdate() {
    const data = {};
    
    if (keys.ArrowUp) {
        data['move'] = 'up';
        data['player'] = 'left'; // Assuming 'ArrowUp' is for the left player
    } else if (keys.ArrowDown) {
        data['move'] = 'down';
        data['player'] = 'left';
    }

    if (keys.w) {
        data['move'] = 'up';
        data['player'] = 'right'; // Assuming 'w' is for the right player
    } else if (keys.s) {
        data['move'] = 'down';
        data['player'] = 'right';
    }

    if (data['move']) {
        data['event'] = 'move';
        console.log("send data to server")
        connection.send(JSON.stringify(data));
    }
}

window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") keys.ArrowUp = true;
    if (event.key === "ArrowDown") keys.ArrowDown = true;
    if (event.key === "w") keys.w = true;
    if (event.key === "s") keys.s = true;

    sendMovementUpdate();
});

window.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp") keys.ArrowUp = false;
    if (event.key === "ArrowDown") keys.ArrowDown = false;
    if (event.key === "w") keys.w = false;
    if (event.key === "s") keys.s = false;

    sendMovementUpdate();
});



// function sendMovementUpdate() {
//     if (player && opponent && ball && canvas && connection) {
//         console.log(dirication);
//         connection.send(JSON.stringify({
//             event: 'move',
//             player: player,
//             opponent: opponent,
//             dirication:dirication,
//             ball: ball,
//             canvas: {
//                 width: canvas.width,
//                 height: canvas.height,
//             }
//         }));
//     }
// }

function updateGame(data) {

    console.log(data);
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





function startGame(player1, player2) {
    initCanvas();
    initPlayers(player1, player2);
    initBall();
    // initKeyHandlers();
    drawGame();
    
    const gameId = "game123";  
    connectToServer(gameId);
}


export function displayGame(player1, player2) {
    const section = document.querySelector(".box");
    const infoPlayers = document.querySelector(".infoPlayers");
    let gameCanvas = document.getElementById("gameCanvas");

    if (section) {
        const display = document.getElementsByClassName("playerInfo");
        for (let i = 0; i < display.length; i++) {
            display[i].classList.add('display');
        }
        // section.style.display = 'none';
        document.querySelector('#usernamePlayer1').textContent = player1;
        document.querySelector('#usernamePlayer2').textContent = player2;
        
        gameCanvas.style.display = 'block';
        infoPlayers.classList.add('display');
        gameCanvas.classList.add('block-1');
        console.log("start game");
        startGame(player1, player2);
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
