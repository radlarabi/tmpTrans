



export function drawRect(x, y, w, h, color) {
    const gameCanvas = document.getElementById('gameCanvas');
const theContext = gameCanvas.getContext('2d');
    theContext.fillStyle = color;
    theContext.fillRect(x, y, w, h);
}

export function drawCircle(x, y, r, color) {
    const gameCanvas = document.getElementById('gameCanvas');
const theContext = gameCanvas.getContext('2d');
    theContext.fillStyle = color;
    theContext.beginPath();
    theContext.arc(x, y, r, 0, 2 * Math.PI, false);
    theContext.closePath();
    theContext.fill();
}


export function drawGame(gameState,data) {
    const gameCanvas = document.getElementById('gameCanvas');
    const theContext = gameCanvas.getContext('2d');
        theContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        let ball;
        let paddles;
        let score;
        // Draw ball
        let player = data.player_side;
        if (gameState) {
            ball = gameState.ball;
            paddles = gameState.paddles; 
            score = gameState.score;
        }
        theContext.beginPath();
        theContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        theContext.fillStyle = '#fff';
        theContext.fill();
        theContext.closePath();

        // Draw paddles

        const localPaddle = player === 'left' ? paddles.left : paddles.right;
        const opponentPaddle = player === 'left' ? paddles.right : paddles.left;

        drawRect(localPaddle.x,localPaddle.y,localPaddle.width,localPaddle.height,"#64CCC5");
        drawRect(opponentPaddle.x,opponentPaddle.y,opponentPaddle.width,opponentPaddle.height,"#64CCC5");



        // theContext.fillRect(localPaddle.x, localPaddle.y, localPaddle.width, localPaddle.height);
        // theContext.fillRect(opponentPaddle.x, opponentPaddle.y, opponentPaddle.width, opponentPaddle.height);

        // Draw score
        // theContext.font = "16px Arial";
        document.querySelector("#player1 .score").textContent =  score.left;
        document.querySelector("#player2 .score").textContent =   score.right;
        // theContext.fillText(`${data.player_username}   ` +  gameState.score.left, 8, 20);
        // theContext.fillText(`${data.opponent_username}  ` + gameState.score.right, 680, 20);
       

}