import { _404 } from '../Error/404.js';
import {Chart} from "../components/Chart.js"
import {getCookie} from "../layers.js"
import { getUser, getProfileAuth } from '../utils/userApis.js'



const getGameHistory = async () => {
    try{
        const res = await fetch("json/recentGames.json")
        const data = await res.json()
        return data;
    }
    catch(err){
        console.error(err)
        return null;
    }
}


export const profile = async (user) => {
    document.title = "Profile"
    let profileData = {}

    if (user === '/profile'){
        // console.log("get profile")

        profileData = await getProfileAuth()
    }else{
        user = user.split("/")[2]
    
        profileData = await getUser(user)
    }
    if(profileData === null){
        return _404()
    }

    let gameHistory = await getGameHistory()
    
    if(!document.body.classList.contains("appBackground"))
        document.body.classList.add("appBackground")

    return `
        <div class="main-profile-content">
            <div class="profile-info-card">

                <div class="profile-info">

                    <div class="profile-info-content">
                        <img src="${profileData.avatar || 'assets/images/default.webp'}" alt="profile" class="profile-info-image" width="150px" height="150px">
                        <div class="profile-info-name">
                            ${profileData.first_name + " " + profileData.last_name}
                        </div>
                        <div class="profile-info-parent">
                            <div class="profile-info-bar">
                                <div class="profile-info-bar-items">
                                    <span class="profile-label-info">AKA  </span>
                                    ${profileData.username || 0}
                                </div>
                                <div class="profile-info-bar-items">
                                    <span class="profile-label-info">Rank  </span>
                                    ${profileData.rank || 0}
                                </div>
                                <div class="profile-info-bar-items">
                                    <span class="profile-label-info">Point  </span>
                                    ${profileData.points || 0}
                                </div>
                                <div class="profile-info-bar-items profile-info-bar-items-last">
                                    <span class="profile-label-info">PlayTime  </span>
                                    ${profileData.played_games_num || 0}
                                </div>
                                
                            </div>
                        </div>

                        <div class="level-profile-container">
                            <div class="level-profile-value">45%</div>
                            <div class="level-profile-bg" style=""></div>
                        </div>
                        
                        <div class="profile-info-level"> LV ${profileData.level || 0}</div>

                    </div>
                </div>
                
                <div class="profile-chart">
                    ${Chart(100)}
                </div>
                
            
            </div>
            <div class="profile-info-card-2">
                <div class="profile-game-history">
                    ${
                        gameHistory  && gameHistory.games.map((game, index) => {
                            return `
                            <div class="game-history-item" key="${index}">
                                <div class="game-history-item-player1">
                                    <img src="${game.player1.profile}" alt="player1" class="game-history-item-player1-image" width="50px" height="50px">
                                </div>

                                <div class="game-history-item-result">
                                    <span class="game-history-item-result-text">${game.score1}</span>
                                    <span class="game-history-item-result-text">:</span>
                                    <span class="game-history-item-result-text">${game.score2}</span>
                                </div>    
                                
                                <div class="game-history-item-player2">
                                    <img src="${game.player2.profile}" alt="player2" class="game-history-item-player2-image" width="50px" height="50px">
                                </div>
                            </div>
                            `
                        
                        }).join("")
                    }
                </div>
                <div class="sec-information">

                </div>
            </div>
        </div>
    `
}


// <div class="profile-info-bar-items">
{/* <span class="profile-label-info">Level  </span>
${parseInt(profileData.experience / 1000)}
</div> */}