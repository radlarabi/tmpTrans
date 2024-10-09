export async function gameHomePage (){
    
    return `
        <div class="containerGame">
            <div class="mt-5 main-content-container-2">
                <div class="modeGameTitle">Mode Game</div>

                <div class="row col-12 justify-content-center align-items-center">

                    <div class="gameModesItem col-8 col-xl-4 mb-2 mb-xl-0">
                        <div class="vsRobot-image-content">
                            <div class="vsRobot-image">
                                <div class="vsPlayer-title">Challenge the Machine!</div>
                                <div class="vsPlayer-subtitle">Test your skills against a formidable opponent!!</div>
                                <a class="vsRobot-button" href="#/game">Play Vs Ai</a>
                            </div>
                        </div>
                    </div>

                    <div class="gameModesItem col-8 col-xl-4 mb-2 mb-xl-0">
                        <div class="vsRobot-image-content">
                            <div class="vsPlayer-image">
                                <div class="vsPlayer-title">Face Off with Friends!</div>
                                <div class="vsPlayer-subtitle">Go Head-to-Head Against Friends!</div>
                                <a class="vsRobot-button" href="#/game/findOpponent" id="">Find Opponent</a>
                            </div>
                        </div>
                    </div>

                    <div class="gameModesItem col-8 col-xl-4 mb-2 mb-xl-0">
                        <div class="vsRobot-image-content">
                            <div class="tournament-image">
                                <div class="vsPlayer-title">Create a Tournament !</div>
                                <div class="vsPlayer-subtitle">Design and manage your ultimate competition!</div>
                                <a class="vsRobot-button" href="#/game">Start Creating</a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div> 
    `;
}