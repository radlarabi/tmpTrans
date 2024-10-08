import  { drawGame } from "./drawGame.js";

const display = document.getElementById("friend");

let currentIndex = 0;

// function showSlide(index) {
//     const slides = document.querySelectorAll('.btn');
//     if (index >= 0 && index < slides.length) {
//         document.querySelector('.section').style.transform = `translateX(${-index * 50}%)`;
//         currentIndex = index;
//     }
// }

// document.addEventListener('keydown', (event) => {
//     if (event.key === 'ArrowRight') {
//         showSlide(currentIndex + 1);
//     } else if (event.key === 'ArrowLeft') {
//         showSlide(currentIndex - 1);
//     }
// });

// Initialize the first slide
// showSlide(currentIndex);



function startTimer() {
    const countdown = document.getElementById("countdownId");
    countdown.innerHTML = `<div class="progress-loader">
    <div class="progress"></div>
    </div>`;
    countdown.classList.add('countdown');
    setTimeout(function() {
    }, 3000);
}

let oppenet_user;
function startGame(data) {

    let socket;
    let player;
    const keysPressed = {};
    const roomName = data.room_name;
    player = data.player_side;
    console.log(` palyer side ---> ${player} <---`)
    oppenet_user = data.opponent.username
    socket = new WebSocket(
        'ws://' + window.location.hostname + ':8001/ws/room/' + roomName + '/');
    
    socket.onopen = function(e) {
        socket.send(JSON.stringify({ 
            'message': 'start',
            'oppenet': oppenet_user

         }));
        console.log("Connection established");
    };

    socket.onmessage = function(e) {
        
        const data = JSON.parse(e.data);
        const gameState = data['game_state'];
        if (gameState) {
            renderGame(gameState, data,oppenet_user);
        }
    };
    
    socket.onclose = function(e) {
        console.log("Connection closed");
    };
    
    function renderGame(gameState, data, opponent) {
        
        drawGame(gameState,data);
        if (gameState.score.left == 5 || gameState.score.right == 5 ) {
            console.log(data);
            socket.send(JSON.stringify({
                   'action': 'game_over',
                   'oppenet': opponent
               }));
            socket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                console.log(data);
            };     
       }
    }

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!keysPressed[key]) {
            keysPressed[key] = true;
            let direction = '';

            if (key === 'ArrowUp') {
                direction = 'up';
            } else if (key === 'ArrowDown') {
                direction = 'down';
            }

            if (direction) {
                socket.send(JSON.stringify({
                    'action': 'move_paddle',
                    'player': player,
                    'oppenet':oppenet_user,
                    'direction': direction,
                }));
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        const key = event.key;
        if (keysPressed[key]) {
            keysPressed[key] = false;
            if (key === 'ArrowUp' || key === 'ArrowDown') {
                socket.send(JSON.stringify({
                    'action': 'move_paddle',
                    'player': player,
                    'oppenet': oppenet_user,
                    'direction': 'stop'
                }));
            }
        }
    });
}

console.log(display);
export function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    
    for(let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();

        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'friend') {
        const displayWait = document.querySelector(".wait");
    const dispalySection = document.querySelector(".section");
    displayWait.classList.add('dispaly');
    dispalySection.classList.add('dispaly');
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3OTY1OTE3LCJpYXQiOjE3Mjc4Nzk1MTcsImp0aSI6IjBhOTMzNWM2YzY1ZDQ2MmJiYjZlMmMyOTQ4OTA5NTUwIiwidXNlcl9pZCI6Mn0.k0iwyKCMm84WO-6-_z9F23Usr6MJgEGkE9GUpkedYEQ';
    document.cookie = 'Authorization=' + `Bearer ${getCookie('token')}` + '; path=/'; // Set the token in cookies
    const matchmaking = new WebSocket(
        'ws://' + window.location.hostname + ':8001/ws/wait_for_opponent/'
    );

    matchmaking.onopen = function () {
        matchmaking.send(JSON.stringify({'message':'Enter Queue'}));
    };

    matchmaking.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.status == 'waiting') {
            const namePlayer = document.getElementById("player");
            const op = document.getElementById("waiting_status");
            namePlayer.innerHTML = `
                <div class="img_pro">
                    <img  class="" src="${"/remoteGame/"+ data.player.avatar}" />
                </div>
                <h3>${data.player.username}</h3>
            `;
            op.innerHTML = `
                <div class="spinner"></div>
            `;
            console.log(data.player.avatar);
        }
        else if (data.status == 'match_found') {
            const namePlayer = document.getElementById("player");
            const op = document.getElementById("waiting_status");
            namePlayer.innerHTML = 
            `   <div class="img_pro">
                    <img  class="" src="${data.avatar_user}" />
                </div>
                <h3>${data.player.username}</h3>
            `;
            // console.log(data.avatar_user);
            op.innerHTML = `
            <div class="img_pro">
                <img  class="" src="${data.opponent_avatar}" />
            </div>
            <h3>${data.opponent.username}</h3>
            `;
            if (data.time == "stop") {
                setTimeout(function() {
                    startTimer();
                }, 2000);
            }
            if (data.game == "start") {
                setTimeout(function() {
                    const section = document.querySelector(".box");
                    const infoPlayers = document.querySelector(".infoPlayers");
                    let gameCanvas = document.getElementById("gameCanvas");
                    if (section) {
                        const display = document.getElementsByClassName("playerInfo");
                        for (let i = 0; i < display.length; i++) {
                            display[i].classList.add('display');
                        }
                        section.style.display = 'none';
                        gameCanvas.style.display = 'block';
                        infoPlayers.classList.add('display');
                        gameCanvas.classList.add('block-1');
                        console.log("start game");
                        startGame(data);
                        }
                }, 5000);
            }




        }
        // const section = document.querySelector(".box");
        // const infoPlayers = document.querySelector(".infoPlayers");
        // let gameCanvas = document.getElementById("gameCanvas");
        // if (section) {
        //     const display = document.getElementsByClassName("playerInfo");
        //     for (let i = 0; i < display.length; i++) {
        //         display[i].classList.add('display');
        //     }
        //     section.style.display = 'none';
        //     gameCanvas.style.display = 'block';
        //     infoPlayers.classList.add('display');
        //     gameCanvas.classList.add('block-1');
        //     console.log("start game");
        //     startGame(data);
        //     }
    };
    matchmaking.onclose = function (e) {
        'ws://' + window.location.hostname + ':8000/ws/wait_for_opponent/'
    }
    }
})
// display.addEventListener('click',function () {
    
    
// });
