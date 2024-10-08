export const game = () => {
    
    return `
        <div class="layerGame">
        <div class="container">
            <div class="box">
                <div class="title">
                    <h1>CUSTOMIZE YOUR GAME</h1>
                </div>
                <button id="friend">friend</button>
                <div class="section">
                    <form>
                        <div class="circle"></div>
                        <button type="submit" class="rounded-box">Generate</button>
                        <div class="rectangle">
                            <div class="grid-container">
                                <div class="grid">
                                    <label class="textGame">Alise</label>
                                    <input type="text" class="button" name="alise"> 
                                </div>
                                
                                <div class="grid">
                                    <label class="textGame">Color</label>
                                    <input type="color" class="button" name="color">
                                </div>
                                <div class="grid">
                                    <label class="textGame">Control</label>
                                    <input type="text" class="button" name="control">
                                </div>
                                <div class="grid">
                                    <label class="textGame">Score</label>
                                    <input type="number" class="button" name="score">
                                </div>
                            </div>
                            <div class="small-box"></div>                
                        </div>
                    </form> 
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
       
        </div> 
    </div>
    `;
}