
export async function localGamePage (){
    
    return `
        <div class="box">
            <div class="infoPlayers">
                <div class="playerInfo" id="player1">
                    <img src="player1-image.jpg" alt="Player 1" class="playerImage">
                    <span class="username"></span>
                    <span class="score">0</span>
                </div> 
                <canvas id="gameCanvas" width="800" height="400" ></canvas>
                <div class="playerInfo" id="player2">
                    <img src="player2-image.jpg" alt="Player 2" class="playerImage">
                    <span class="username"></span>
                    <span class="score">0</span>
                </div>
                <div id="gameOverModal" class="modal">
                    <div class="modal-content">
                        <img src ="../images/medal.png">
                        <h2 id="gameOverMessage"></h2>
                        <p>Final score:   <span id="opponentScore"></span> - <span id="playerScore"></span></p>
                        <div class="option">
                            <i class="bi bi-box-arrow-left" ></i>
                            <i class="bi bi-arrow-clockwise" id="restartButton" ></i>
                        </div>
                    </div>
                </div>                 
            </div>
        </div>
    `
}