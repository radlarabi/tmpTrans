
export async function localGamePage (){
    
    return `
        <div class="box">
            <div class="aliasPlayers">
                <div class="playerAlias" id="player1">
                    <label for="player1NameAlias">Player 1</label>
                    <input type="text" id="player1NameAlias" placeholder="Player 1"/>

                </div>
                <div class="playerAlias" id="player2">
                    <label for="player2NameAlias">Player 2</label>
                    <input type="text" id="player2NameAlias" placeholder="Player 2"/>
                </div>
                <button id="start-game-local">Start Game</button>
            </div>

        </div>
    `
}