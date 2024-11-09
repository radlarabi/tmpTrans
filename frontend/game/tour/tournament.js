// Sample list of players
const players = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hank"];

// Initialize the tournament
function initTournament(players) {
    const shuffledPlayers = shuffle(players);
    let rounds = [shuffledPlayers];

    // Generate each round until we have a champion
    while (rounds[rounds.length - 1].length > 1) {
        rounds.push(createNextRound(rounds[rounds.length - 1]));
    }

    renderTournament(rounds);
}

// Shuffle players for a random starting bracket
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create the next round from winners of the current round
function createNextRound(currentRound) {
    const nextRound = [];
    for (let i = 0; i < currentRound.length; i += 2) {
        if (currentRound[i + 1]) {
            nextRound.push(null); // Placeholder for the winner
        } else {
            nextRound.push(currentRound[i]); // Automatic advancement
        }
    }
    return nextRound;
}

// Render the tournament bracket
function renderTournament(rounds) {
    const tournamentDiv = document.getElementById('tournament');
    tournamentDiv.innerHTML = '';

    rounds.forEach((round, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');
        roundDiv.innerHTML = `<h2>Round ${roundIndex + 1}</h2>`;
        
        round.forEach((player, matchIndex) => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            if (player !== null) {
                matchDiv.innerHTML = `<span>${player}</span>`;
            } else {
                matchDiv.innerHTML = `
                    <button onclick="setWinner(${roundIndex}, ${matchIndex}, '${round[matchIndex * 2]}')">${round[matchIndex * 2]}</button>
                    vs 
                    <button onclick="setWinner(${roundIndex}, ${matchIndex}, '${round[matchIndex * 2 + 1]}')">${round[matchIndex * 2 + 1]}</button>
                `;
            }
            roundDiv.appendChild(matchDiv);
        });
        tournamentDiv.appendChild(roundDiv);
    });
}

// Set the winner and advance to the next round
function setWinner(roundIndex, matchIndex, winner) {
    const nextRound = roundIndex + 1;
    const rounds = Array.from(document.getElementById('tournament').querySelectorAll('.round'));
    if (rounds[nextRound]) {
        rounds[nextRound].children[Math.floor(matchIndex / 2)].innerHTML = `<span>${winner}</span>`;
    } else {
        alert(`Champion: ${winner}!`);
    }
}

// Start the tournament
initTournament(players);
