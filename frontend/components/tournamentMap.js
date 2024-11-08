export async function tournamentMap(id){
    
    return `
        <div class="tournament-map-container">
            <div class="tournament-map-title"> Welcome To The Tournament ${id} </div>
            <div class="tournament-map">
                <div class="tournament-map-items demi-final">
                    <div class="tournament-demi-final-1">
                        <div class="tournament-player-map"> Player 1</div>
                        <div class="tournament-player-map-score"> 5 </div>
                    </div>
                    
                    <div class="tournament-demi-final-1">
                        <div class="tournament-player-map"> Player 1</div>
                        <div class="tournament-player-map-score"> 5 </div>
                    </div>
                    <img src="assets/test.svg" alt="bracket" class="bracket-tournament-1 ">

                </div>
                
                <div class="tournament-map-items final">
                    <div class="tournament-final">
                        <div class="tournament-player-map tournament-final-player-1"> Player 1</div>
                        <div class="tournament-player-map tournament-final-player-2"> Player 2</div>
                    </div>
                </div>
                
                <div class="tournament-map-items demi-final">
                    <div class="tournament-demi-final-2">
                    <div class="tournament-player-map-score"> 5 </div>
                        <div class="tournament-player-map"> Player 2</div>
                    </div>

                    <div class="tournament-demi-final-2">
                    <div class="tournament-player-map-score"> 5 </div>
                        <div class="tournament-player-map"> Player 2</div>
                    </div>

                    <img src="assets/test.svg" alt="bracket" class="bracket-tournament-2 ">

                </div>
            </div>
        </div>
    `
}

/* <svg version="1.1" id="connections" x="0px" y="0px" viewBox="0 0 1478 762.7" preserveAspectRatio="none">
<g id="shadow">
    <polyline id="8_erlines_15" class="st0" points="1376.3,66 1275.8,58.5 1275.8,134.5 1376.3,137.9 	"></polyline>
    <polyline id="8_erlines_14" class="st0" points="1376.3,248.9 1275.8,248.9 1275.8,324.9 1376.3,328.3 	"></polyline>
    <polyline id="8_erlines_13" class="st0" points="1376.3,441.8 1271,441.8 1275.8,519.5 1376.3,516.2 	"></polyline>
    <polyline id="8_erlines_12" class="st0" points="1376.3,630.6 1275.8,630.6 1271,716.6 1376.3,706.6 	"></polyline>
    <polyline id="8_erlines_11" class="st0" points="112.5,60.3 206,66.1 207.3,138.2 112.5,138.2 	"></polyline>
    <polyline id="8_erlines_10" class="st0" points="112.5,254.1 206,254.1 207.3,328.1 112.5,328.1 	"></polyline>
    <polyline id="8_erlines_9" class="st0" points="112.5,435.7 210.3,441.5 206,515.8 112.5,515.8 	"></polyline>
    <polyline id="8_erlines_8" class="st0" points="112.5,623.7 204.6,631.7 206,706.4 112.5,706.4 	"></polyline>
    <polyline id="4_erlines_7" class="st0" points="1275.8,98.2 1057.5,98.2 1053.8,284 1275.8,288.6 	"></polyline>
    <polyline id="4_erlines_6" class="st0" points="1273.4,480.7 1053.8,473.6 1057.5,673.6 1273.4,673.6 	"></polyline>
    <polyline id="4_erlines_5" class="st0" points="206,99.3 421.1,101.7 421.1,284.9 206,291.1 	"></polyline>
    <polyline id="4_erlines_4" class="st0" points="206,473.3 421.1,479 425.2,665.1 205.4,672.6 	"></polyline>
    <polyline id="2_erlines_3" class="st0" points="1055.6,193.4 843.5,198 847.3,565.4 1055.6,573.6 	"></polyline>
    <polyline id="2_erlines_2" class="st0" points="421.1,192.1 635.8,195.2 630.7,572.9 421.1,572.9 	"></polyline>
    <line id="1_erlines_3" class="st0" x1="739.2" y1="480.7" x2="846.4" y2="480.7"></line>
    <line id="1_erlines_2" class="st0" x1="749.2" y1="288.2" x2="634.5" y2="288.2"></line>
</g>
<g id="lines">
    <polyline id="_8_erlines" class="st1" points="1381.3,61 1280.8,53.5 1280.8,129.5 1381.3,132.9 	"></polyline>
    <polyline id="8_erlines_1" class="st1" points="1381.3,243.9 1280.8,243.9 1280.8,319.9 1381.3,323.3 	"></polyline>
    <polyline id="8_erlines_6" class="st1" points="1381.3,436.8 1276,436.8 1280.8,514.5 1381.3,511.2 	"></polyline>
    <polyline id="8_erlines_7" class="st1" points="1381.3,625.6 1280.8,625.6 1276,711.6 1381.3,701.6 	"></polyline>
    <polyline id="8_erlines_2" class="st1" points="107.5,55.3 201,61.1 202.3,133.2 107.5,133.2 	"></polyline>
    <polyline id="8_erlines_3" class="st1" points="107.5,249.1 201,249.1 202.3,323.1 107.5,323.1 	"></polyline>
    <polyline id="8_erlines_4" class="st1" points="107.5,430.7 205.3,436.5 201,510.8 107.5,510.8 	"></polyline>
    <polyline id="8_erlines_5" class="st1" points="107.5,618.7 199.6,626.7 201,701.4 107.5,701.4 	"></polyline>
    <polyline id="4_erlines_2" class="st1" points="1280.8,93.2 1062.5,93.2 1058.8,279 1280.8,283.6 	"></polyline>
    <polyline id="4_erlines_3" class="st1" points="1278.4,475.7 1058.8,468.6 1062.5,668.6 1278.4,668.6 	"></polyline>
    <polyline id="_4_erlines" class="st1" points="201,94.3 416.1,96.7 416.1,279.9 201,286.1 	"></polyline>
    <polyline id="4_erlines_1" class="st1" points="201,468.3 416.1,474 420.2,660.1 200.4,667.6 	"></polyline>
    <polyline id="2_erlines_1" class="st1" points="1060.6,188.4 848.5,193 852.3,560.4 1060.6,568.6 	"></polyline>
    <polyline id="_2_erlines" class="st1" points="416.1,187.1 630.8,190.2 625.7,567.9 416.1,567.9 	"></polyline>
    <line id="1_erlines_1" class="st1" x1="744.2" y1="475.7" x2="851.4" y2="475.7"></line>
    <line id="_1_erlines" class="st1" x1="744.2" y1="283.2" x2="629.5" y2="283.2"></line>
</g>
</svg>
*/