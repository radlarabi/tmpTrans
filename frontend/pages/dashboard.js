import { jungleButton } from "../components/Button.js"
import { searchBar } from "../components/SearchBar.js"

import { getUser } from '../utils/userApis.js'
import { getProfileAuth } from '../utils/userApis.js'
let user = {};

let recentGames = {};

const getChatUsers = async (friends) => {
    if (!friends)
        return null;
    let myFriends = [];

    friends.forEach(async (friend ) => {
        try{
            myFriends.push(await Promise.resolve(getUser(friend)));
        }
        catch(err){
            console.error(err)
            return null;
        }
    });
    return myFriends;
        // try{
    //     const res = await fetch("json/chatUsers.json")
    //     const data = await res.json()
    //     return data;
    // } catch(err){
    //     console.error(err)
    //     return null;
    // }
}

const getRecentHistory = async () => {
    try{
        const res = await fetch("json/recentGames.json")
        const data = await res.json()
        return data;
    } catch(err){
        console.error(err)
        return null;
    }

}
const usersSearch = async () => {
    try {
        const api = await fetch("http://localhost:8000/api/profile/usersList/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            }
        })
        if (!api.ok){
            console.error("api failed")
            throw new Error("api failed")
        }
        const data = await api.json()
        return data;
    }catch(err){
        console.error(err)
        return null;
    }
}



export const dashboard = async () => {
    document.title = "Dashboard"

    user = await getProfileAuth();
    recentGames = await getRecentHistory()
    window.location.hash = '#/dashboard'
    
    const userList = await usersSearch();
    console.log("userList is ", userList)

    document.addEventListener('input', (e) => {

        if (e.target.id === 'inputSearchUsers'){

            const filterList = userList.filter(user => user.username.toLowerCase().includes(e.target.value.toLowerCase()))
            const listUsersSearch = document.getElementById('usersSearchElement')
            
            if (filterList.length === 0)
                return listUsersSearch.innerHTML = 'no user found'
            
            if (e.target.value === '')
                return document.getElementById("listUsersSearch").style.display = 'flex'
            
            document.getElementById("listUsersSearch").style.display = 'flex'
            
            listUsersSearch.innerHTML = filterList.map(user => {
                return `
				    <a href="#/profile/${user?.username}" class="usersSearchElementUsername" >${user?.username}</a>
                `
            })

        }
    })

    document.body.classList.add("appBackground")
    return `
        <div class="dashboard-container" id="dashboard-container">

            <div class="main-content">

                <div class="mobileAppMenu">
                    <div onclick="toggleBurgerMenu()" ><img src="assets/icons/burger-menu.svg" width="50px" heigth="50px"/></div>
                    <div onclick="" class="notification mobile-notification" > <img src="assets/icons/notification.svg" width="30px" height="30px"> </div>
                </div>
                <div class="dashboard-head">
                    <div class="d-flex flex-row align-items-center ">
                        <h4 class="welcome-text">
                            ${
                                new Date().getHours() > 12 ?  "Good evening ," : 'Good morning ,'
                            }
                        </h4>

                        <h4 class="welcome-subtext">${user && String(user.username).toUpperCase()}</h4>

                    </div>

                    <div class="notification">
                        ${searchBar(userList)}
                        <div onclick="showNotification()" class="notification-icon"> <img src="assets/icons/notification.svg" width="30px" height="30px"> </div>
                    </div>
                </div>

                <div class="dashboard-content">

                    <div class="dashboard-content-1">

                        <div class="head-line placeholder-glow">
                            <div class="head-line-container">

                                <div class="dragon-image-container">
                                    <img src="assets/images/hero5.png" alt="dragon" class="dragon-image">
                                </div>

                                <div class="head-line-text">
                                    <div class="head-line-text-title">Jungle Paddle</div>
                                    <div class="head-line-text-p">Survive, Explore, and Master the Ping Pong Wilderness! Navigate through dense competition foliage, mastering your paddle skills amidst the wild terrain. Join the adventure now!</div>

                                    <div class="head-line-button">
                                        ${jungleButton()}
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div class="history-recent">
                            <div class="history-recent-container">
                                <div class="recentHistoryTitle">Recent history</div>
                                ${
                                    recentGames.games && recentGames.games.slice(0, 3).map((game, index) => {
                                        return `
                                            <div class="history-recent-item" key=${index}>
                                                <a href="#/profile/${game.player1.name}" key=${index} class="history-recent-image1">
                                                <img src="${game.player1.profile}" alt="game" class="rounded-circle" width="50px" height="50px"/>
                                                </a>
                                                <div class="history-recent-name">${game.player1.name}</div>

                                                <div class="history-recent-score">
                                                ${game.score1} - ${game.score2}
                                                </div>

                                                <div class="history-recent-name">${game.player2.name}</div>

                                                <a href="#/profile/${game.player2.name}" key=${index} class="history-recent-image2">
                                                    <img src="${game.player2.profile}" alt="game" class="rounded-circle" width="50px" height="50px">
                                                </a>
                                            </div>
                                        `
                                    }).join("")
                                }
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-content-2">
                        <div class="main-content-container-2">
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
                                            <a class="vsRobot-button" href="#/game">Find Opponent</a>
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

                </div>

            </div>
        </div>
    `
}
