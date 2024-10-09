export async function findOpponent (){
    return `
    <div class="box">
        <button id="friend">friend</button>
        <div class="section">
            
        </div>
        <div id="aaaa">
        </div>
        <div class="wait">
            <div class="player_user">
                <span id="player">
                </span>
            </div>
            <h1>VS</h1>
            <div class="opponent_user">
                <span id="waiting_status">
                </span>
            </div>
        </div>
        <div id="countdownId">
            <span></span>
        </div>

    </div>
    <div class="infoPlayers">
        <div class="playerInfo" id="player1">
            <img src="player1-image.jpg" alt="Player 1" class="playerImage">
            <p>Nickname: <span class="nickname">PlayerOne</span></p>
            <span id="player1-controls">(↑/↓)</span>
            <p>Score: <span class="score">0</span></p>
        </div> 
        <canvas id="gameCanvas" width="800" height="400" style="display:none;"></canvas>
        <div class="playerInfo" id="player2">
            <img src="player2-image.jpg" alt="Player 2" class="playerImage">
            <p>Nickname: <span class="nickname">PlayerTwo</span></p>
            <span id="player2-controls">(W/S)</span>
            <p>Score: <span class="score">0</span></p>
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
    `
}