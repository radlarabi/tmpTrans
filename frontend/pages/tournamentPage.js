const getTournament = async () => {
    try {
        const response = await fetch('http://localhost:8001/api/tournaments/categorize_tournaments/');
        if (!response.ok){
            throw new Error(response.status)
        }
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error(error);
        return null
    }
}

// const getTournamentDetails = async (tournamentId) => {
//     try {
//         const response = await fetch(`http://localhost:8001/api/tournaments/${tournamentId}/`);
//         const data = await response
//     } catch (error) {
        
//     }
// }


export async function tournamentPage() {
    const tournaments = await getTournament();

    console.log("tournaments are ", tournaments)
    return `
    <div class="tournament-container">
        <div id="tournament-creation"></div>
            <div class="tournament-header">
                <h1> Tournament Page </h1>
                <button id="create-tournament" onclick="createTournament()"> Create Tournament </button>
            </div>
            <div class="tournaments">
                <h3>List of available tournaments</h3>
                ${
                    tournaments?.active_tournaments?.map(tournament => `
                        <div class="tournament-items">
                            <h2> ${tournament} </h2>
                            <button id="joinTournament" data-tournament="${tournament}" > Join </button>
                        </div>
                        `
                    ).join('')
                }
            </div>
        </div>
    `
}