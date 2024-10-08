import { _404 } from './Error/404.js';
import { home } from './pages/home.js';
import {callPages, getCookie} from './layers.js';
import { login } from './pages/login.js';
import { animatedBackground } from './utils/backgroundAnimation.js';

const rootDiv = document.getElementById('root');

const randomData = {
    lose: 50 ,
    win: 15 ,
    draw: 25 ,
}

const data = [
    {value: (randomData.lose), color: "#36A2EB" },
    {value: (randomData.win), color: "#FF6384" },
    {value: (randomData.draw), color: "#FFCE56" },
];

function drawDoughnutChart(data) {
    const canvas = document.getElementById("chart");

    if (!canvas.getContext) return;
    
    const ctx = canvas.getContext("2d");

    const totalValue = data.reduce((sum, dataPoint) => sum + dataPoint.value, 0);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const outerRadius = Math.min(centerX, centerY);
    const innerRadius = outerRadius / 1.2;
    
    let startAngle = 0;

    data.forEach(dataPoint => {
        
        const sliceAngle = (dataPoint.value / totalValue) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = dataPoint.color;
        ctx.fill();

        startAngle = endAngle;
    });
    return canvas;
}
const routes = ['/dashboard', '/game', '/leaderboard', '/settings', '/chat'];

const router = async (e) => {
    console.log("..... router called with ", e.type)

    const url = window.location.hash.split('#').pop();
    console.log("url is : ", url)
   
    if (url !== '' && url !== '/')
        animatedBackground()
   
    if (routes.includes(url) || url.startsWith('/profile')) {
        const html = await callPages(url);
        rootDiv.innerHTML = html;
        if (document.getElementById("chart")) {
            drawDoughnutChart(data)
        }
    }else if (url === '/' || url === '')
        rootDiv.innerHTML = await home();
    else if (url === '/login')
        rootDiv.innerHTML = await login();
    else 
        rootDiv.innerHTML = _404();

    console.log("router called")
    setInterval(() => {
        document.getElementById('loading').style.display = 'none';
    } , 1500)
}

window.addEventListener('load', router);
window.addEventListener('popstate', router);





window.addEventListener('DOMContentLoaded', async () => {


    const url1  = new URL(window.location.href)
    const code = url1.searchParams.get('code')
    
    if (code){
        try {
            const api = await fetch(`http://localhost:8000/api/auth/code/?code=${code}`, {
                method: 'GET',
            })
            if (!api.ok)
                throw new Error(api.status)
            const data = await api.json()

            // set token in cookie
            if (!data.access || !data.refresh){
                console.error("no access token")
                throw new Error("No access token")
            }
            document.cookie = `token=${data.access}; path=/`;
            document.cookie = `refresh=${data.refresh}; path=/`;

            // remove code from url
            window.history.replaceState({}, document.title, "/")

            // redirect to dashboard
            document.getElementById('loading').style.display = 'flex';
            setInterval(() => {
                document.getElementById('loading').style.display = 'none';
            } , 1500)
            window.location.hash = '#/dashboard'
            
        } catch (error) {
            console.error("error in getting token from code -----------------------------------")
            console.error(error)
            window.history.replaceState({}, document.title, "/");
            window.location.hash = '#/login'
            showFlashNotification("An ERROR occured try to login again", "error")
        }
        return 
    }

})

export async function checkToken() {

    const redirect = (e) => {
        console.error(e)
        console.log("redirecting to login")
        return false
    }

    const url = window.location.hash.split('#').pop();
    
    console.log("dom content loading", url)
    const token = getCookie('token')
    console.log("************************* token is ", token)

    if (!token && url !== '/login' && url !== '/' && url !== ''){
        console.log("redirecting to login")
        // window.location.hash = '#/login'
        return false
    }
    try {
        const req = await fetch('http://localhost:8000/api/profile/details/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!req.ok){
            console.log("refreshing token")
            try{
                const req = await fetch('http://localhost:8000/api/auth/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({refresh: getCookie('refresh')})
                })
                if (!req.ok){
                    console.error("refresh token failed")
                    throw new Error(req.status)
                }
                const data = await req.json()
                if (!data.access || !data.refresh){
                    console.error("no access token")
                    throw new Error("No access token")
                }
                console.log("data is " , data)
                document.cookie = `token=${data.access}; path=/`;
                document.cookie = `refresh=${data.refresh}; path=/`;
                return true
            }catch(e){
                redirect(e)
                return false
            }
        }
        console.log("Verified token")
        return true
    }catch(e){
        redirect(e)
        return false
    }
    // if (url == '/login' || url == '/' || url == ''){
    //     console.log("redirecting to dashboard")
    //     window.location.hash = '#/dashboard'
    // }
}