import { LeftNavBar } from "./components/LeftNavBar.js"
import { RightNavBar } from "./components/RigthNavBar.js";
import { dashboard } from './pages/dashboard.js';
import { settings } from './pages/settings.js';
import { home } from './pages/home.js';
import { profile } from './pages/profile.js';
import { game } from './pages/game.js';
import { leaderboard } from './pages/leaderboard.js';
import { login } from './pages/login.js';
import { _404 } from './Error/404.js';
import { animatedBackground } from './utils/backgroundAnimation.js';
import { checkToken } from "./apps.js";


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

const HomeContent = async (url) => {

    console.log("home content")
    return `
    <div class="" style="display: flex; justify-content: space-between">
        ${LeftNavBar()}
            ${
                url === '/dashboard' ? `${await dashboard()}` :
                url.startsWith('/game') ? `${await game()}` :
                url === '/leaderboard' ? `${await leaderboard()}` :
                url === '/settings' ? `${await settings()}` :
                url.startsWith('/profile') ? `${await profile(url)}` : ''
            }
        ${await RightNavBar()}
    </div>    
    `
}
function logout(){
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.hash = '#/login'
}

export const callPages = async (url) => {
    animatedBackground()

    console.log("call pages")
    if (!await checkToken()){
        console.log("checking token ...")
        logout()
        return await login();
    }
    console.log("token checked !!!!")
    switch(url) {
        case '/':
            return await home();
        case '':
            return await home();
        case '/login':
            return await login();
        default:
            return await HomeContent(url);
    }
}
