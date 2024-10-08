let leaderBoard = {};

const getLeaderBoard = async () => {
    try{
        const res = await fetch("json/leaderBoard.json")
        const data = await res.json()
        return data;
    } catch(err){
        console.error(err)
        return null;
    }

}

export const leaderboard = async () => {
    document.title = "Leaderboard"

    window.location.hash = '#/leaderboard'

    leaderBoard = await getLeaderBoard();
    leaderBoard = leaderBoard.users.sort((a, b) => b.score - a.score)
    
    const top3Players = []
    if (leaderBoard.length > 1) {
        top3Players.push({
            name: leaderBoard[1].name,
            login: leaderBoard[1].login,
            profile: leaderBoard[1].profile,
            score: leaderBoard[1].score,
        })
    }
    if (leaderBoard.length > 0) {
        top3Players.push({
            name: leaderBoard[0].name,
            login: leaderBoard[0].login,
            profile: leaderBoard[0].profile,
            score: leaderBoard[0].score,
        })
    }
    if (leaderBoard.length > 2) {
        top3Players.push({
            name: leaderBoard[2].name,
            login: leaderBoard[2].login,
            profile: leaderBoard[2].profile,
            score: leaderBoard[2].score,
        })
    }
    

    return `
        <div class="leader-board">
            <div class="LeaderBoardTitle" >LeaderBoard</div>
            <div class="top-3-players">
                ${
                    top3Players.map((user, index) => `
                        <div key="${index}" class="top-3-players-item px-2 px-sm-5" >
                            
                            <div class="top-3-players-item-image-container">
                                <img class="top-3-players-item-badge" src="${"assets/icons/" + (index + 1) + "PlaceBadge.svg"}" style="${index == 1 ? 'top: 0px' : ''}" />
                                <img  class="top-3-players-item-image" style="${index == 1 ? 'margin-top: -50px' : ''}" src="${user.profile}" />
                            </div>
                        
                        </div>
                    `).join("")
                }
            </div>
            <div class="other-top-players-info p-3 rounded">
                <div class="other-top-players-header row m-0 py-2">
                    <div class="other-top-players-header-items col-1"></div>
                    <div class="other-top-players-header-items col-4">Name</div>
                    <div class="other-top-players-header-items col-4">Score</div>
                    <div class="other-top-players-header-items col-3">Score</div>
                </div>
                <div class="other-top-players">
                ${
                    leaderBoard && leaderBoard.length > 3 ? leaderBoard.slice(3).map((user, index) => `
                        <div
                            style="background-color: ${index % 2 ? '#80808080' : ''}" 
                            class="other-top-players-item row mx-0 my-1 py-2 rounded ">
                            <div class="other-top-players-item-rank col-1">${index + 4}</div>
                            <div class="other-top-players-item-rank col-4">${user.name}</div>
                            <div class="other-top-players-item-rank col-4">${user.name}</div>
                            <div class="other-top-players-item-rank col-3">${user.name}</div>
                        </div>
                    `).join("") 
                        : ''
                } 
                </div>
            </div>
        </div>
    `
} 
