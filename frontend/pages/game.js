import { _404 } from "../Error/404.js";
import { findOpponent } from "./findOpponent.js";
import { gameHomePage } from "./gameHomePage.js";
import { localGamePage } from "./localGamePage.js"

export const game = async () => {
    const url = window.location.hash.split('/').pop()
    console.log("url of the game is : ", url)

    switch(url){
        case 'findOpponent':
            return await findOpponent();
        case 'localGame':
            return await localGamePage();
        case 'game':
            return gameHomePage()
        default:
            return _404();
    }
}