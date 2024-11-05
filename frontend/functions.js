// import { getProfileAuth } from "./utils/userApis"

function showFlashNotification(message, type, duration = 3000){

    const notificationContainer = document.getElementById('flash-notification-container')
    if (notificationContainer.childElementCount >= 3)
        return

    const notification = document.createElement('div')
    notification.classList.add('flash-notification')
    
    
    

    
    // delay the notification to show after the previous one
    setTimeout(() => {
        notification.classList.add('showFlashNotification')
    }, notificationContainer.childElementCount * 100)
    
    notification.style.top = `${notificationContainer.childElementCount * 70}px`
    
    notificationContainer.appendChild(notification)
    
    const messageElement = document.createElement('div')
    messageElement.textContent = message

    notification.appendChild(messageElement)
    
    switch(type){
        case 'success':
            notification.style.backgroundImage = 'linear-gradient(to right, #0abf3059, #22242faa 95%)'
            notification.style.borderLeft = '3px solid #0abf31e3'
            break
        case 'error':
            notification.style.backgroundImage = 'linear-gradient(to right, #bf2e0abb, #22242faa 95%)'
            notification.style.borderLeft = '3px solid #bf2e0a'
            break
        case 'warning':
            notification.style.backgroundImage = 'linear-gradient(to right, #bfb30abb, #22242faa 95%)'
            notification.style.borderLeft = '3px solid #bfb30a'
            break
        case 'info':
            notification.style.backgroundImage = 'linear-gradient(to right, #0a77bfbb, #22242faa 95%)'
            notification.style.borderLeft = '3px solid #0a77bf'
            break
        default:
            notification.style.backgroundColor = 'black'
            notification.style.borderLeft = '3px solid black'
    }

    setTimeout(() => {
        notification.classList.remove('showFlashNotification')
        notification.classList.add('hideFlashNotification')
        setTimeout(() => {
            notification.remove()
        }, 500)
    }, duration)

}

function goToSignUp () {
    const formLogin = document.querySelector('.form-login')
    const formSignUp = document.querySelector('.registration-form')

    formLogin.style.display = "none"
    formSignUp.style.display = "flex"
    
    formSignUp.style.transform = "translateX(0)"
}

function goToSignIn () {
    const formLogin = document.querySelector('.form-login')
    const formSignUp = document.querySelector('.registration-form')

    formLogin.style.display = "flex"
    formSignUp.style.display = "none"

    formSignUp.innerHTML = registrationForm()
}

const mobileMenContent = () => {
    return `
    <div class="mobileAppMenu-content" id="mobileAppMenu-content">
        <div onclick="closeBurgerMenu()" class="close-menu"><img src="assets/icons/close-menu.svg" width="40px" heigth="40px"/></div>
        <div class="mobileAppMenu-links" >

            <a href="#/dashboard" > Dashboard </a>
            <a href="#/profile" > Profile </a>
            <a href="#/game" > Game </a>
            <a href="#/chat" > Chat </a>
            <a href="#/leaderboard" > Leaderboard </a>
            <a href="#/setting" > Setting </a>
            <button class="BtnLogOut" onclick="logout()">
                <div class="signLogOut">
                    <svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
                </div>    
                <div class="textLogOut">Logout</div>
            </button>
        </div>
    </div>`
}

function toggleBurgerMenu () {
    const menu = document.querySelector('.mobileAppMenu');

    if (menu) {
        const menuContent = document.createElement('div');
        menuContent.classList.add('mobileAppMenu-content');
        menuContent.innerHTML = mobileMenContent();
        menu.appendChild(menuContent);
        document.body.style.overflow = 'hidden';
    }

}
function closeBurgerMenu () {
    const menu = document.querySelector('.mobileAppMenu-content');
    menu.remove();
    // enable scrolling
    document.body.style.overflow = 'auto';
}

var showNotificationIndex = false;

function showNotification () {

    if (showNotificationIndex){
        document.querySelector('.notification-content-containner').remove();
        showNotificationIndex = false;
        return
    }

    const notification = document.querySelector('.notification-icon');
    const notificationContent = document.createElement('div');
    notificationContent.classList.add('notification-content-containner');
    notificationContent.innerHTML = `
        <div class="notification-content">
            
        </div>
        `
    notification.appendChild(notificationContent);
    showNotificationIndex = true;
}

async function continueWith42(){
    window.location.href = 'http://localhost:8000/api/auth/auth42/'
    
}
function verificationEmail (){
    return `
        <div class="verify-email-container">
            <img src="assets/images/verifyEmail.png" alt="verifyEmail" class="verifyEmail">
            <div class="registration-form-login-title">Verify your email address</div>
            <div class="verify-email-description">You've entered <strong>lar.radouan@gmail.com</strong> as the email address for your account.</div>
            <div class="verify-email-description">Please verify this email address by checking you inbox</div>
            <button class="form-header-button-login" id="login" onclick="goToSignIn()">SignIn</button>
        </div>
    `
}
function registrationForm(){
    return `
        <div class="form-header">
            <button class="form-header-button-login registration-form-header-button-login" id="login" onclick="goToSignIn()">SignIn</button>
            <button class="form-header-button-signUp registration-form-header-button-signUp" id="signUp" >signUp</button>
        </div>

        <div class="registration-form-login-title">Sign Up</div>
        <div class="registration-form-name">
            <input type="text" id="form-registration-input-firstname" class="form-login-input-name" placeholder="First Name">
            <input type="text" id="form-registration-input-lastname" class="form-login-input-name" placeholder="Last Name">
        </div>
        <input type="text" id="form-registration-input-username" class="form-login-input-username" placeholder="Username">
        <input type="text" id="form-registration-input-email" class="form-login-input-email" placeholder="Email">
        <input type="password" id="form-registration-input-password1" class="form-login-input-password" placeholder="password">
        <input type="password" id="form-registration-input-password2" class="form-login-input-password" placeholder="re-enter password">

        <button type="submit" class="form-login-button" id="form-registration-submit" value="SignIn" onclick="submitRegistration()">SignIn</button>

        <div class="form-login-footer-or"> Or </div>

        <div class="form-login-footer-social-media">
            <button class="form-login-social-media-button">
                <div class="form-login-footer-social-media-content">
                    <img class="img42" src="assets/icons/42_Logo.svg"> continue with 42
                </div>
            </button>
        </div>
    `
}
async function submitRegistration(){
    const form = document.getElementById('form-registration-submit')

    const data = {
        first_name: document.getElementById('form-registration-input-firstname').value,
        last_name: document.getElementById('form-registration-input-lastname').value,
        username: document.getElementById('form-registration-input-username').value,
        email: document.getElementById('form-registration-input-email').value,
        password: document.getElementById('form-registration-input-password1').value,
        password2: document.getElementById('form-registration-input-password2').value,
    }

    if (!data.first_name || !data.last_name || !data.username || !data.email || !data.password || !data.password2){
        showFlashNotification('Please fill all fields', 'warning')
        return
    }
    
    if (data.password !== data.password2){
        showFlashNotification('Passwords do not match', 'warning')
        return
    }

    try {
        const response = await fetch('http://localhost:8000/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok)
            throw await response.json()

        showFlashNotification('Registration successful', 'success')
        document.querySelector('.registration-form').innerHTML = verificationEmail()
    } catch (error) {

        if (error.email)
            showFlashNotification('this email is aleady used', 'error')
        if (error.username)
            showFlashNotification('this username is aleady used', 'error')

        return null;
    }
    
}

async function submitLogin() {
    // showFlashNotification('Logging in...', 'info')

    let response = null;
    const data = {
        username: document.getElementById('form-login-input-username').value || null,
        password: document.getElementById('form-login-input-password').value || null
    }

    if (!data.username || !data.password){
        showFlashNotification('Please fill all fields', 'warning')
        return
    }

    try{
       const res = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        response = await res.json()
        // console.log(response)
        if (!res.ok)
            throw response
    
    }catch(e){
        if(e.response)
            showFlashNotification("You need to verify your email first", 'error')
        else if(e.Error)
            showFlashNotification("Invalid username or password", 'error')
        return null
    }

    if (response && response.message == 'Logged in'){
        
        
        document.cookie = `token=${response.access}; path=/`;
        document.cookie = `refresh=${response.refresh}; path=/`;
        window.location.hash = '#/dashboard'
    }
}

function logout(){
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.hash = '#/login'

    
}

function toggleProfile(){
    const profile = document.querySelector('.toggleProfile')
    if (!profile)
        return
    if (profile.style.display === "flex"){
        profile.style.display = "none"
        return
    }
    profile.style.display = "flex"
}


// document.addEventListener('DOMContentLoaded', async () => {


// })

function getCookie(name) {
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

async function editPassword () {
    const old_password = document.getElementById('old_password').value
    const password = document.getElementById('new_password').value
    const password2 = document.getElementById('confirm_new_password').value

    if (!old_password || !password || !password2){
        showFlashNotification('Please fill all fields', 'warning')
        return
    }
    if (password !== password2){
        showFlashNotification('Passwords do not match', 'warning')
        return
    }
    try{
        const res = await fetch('http://localhost:8000/api/profile/edit/password/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({
                old_password: old_password,
                password: password,
                password2: password2
            })
        })
        if (res.status === 401){
            window.location.hash = '#/login'
            return
        }        
        const data = await res.json()

        if (!res.ok)
            throw data
        showFlashNotification('Password updated successfully', 'success')
    }catch(e){

        if (e.old_password)
            showFlashNotification(e.old_password, 'error')
        if (e.password)
            showFlashNotification(e.password, 'error')
        if (e.password2)
            showFlashNotification(e.password2, 'error')
        if (e.message)
            showFlashNotification(e.message, 'error')
        console.error(e.message)
    }

}

async function editProfile ()  {


    const data = {
        first_name : document.getElementById('first_name').value,
        last_name : document.getElementById('last_name').value,
        username : document.getElementById('username').value,
        email : document.getElementById('emailProfileSetings').value,
    }
    
    if (!data.first_name || !data.last_name || !data.username || !data.email){
        showFlashNotification('Please fill all fields', 'warning')
        return
    }

    try{
        const api = await fetch("http://localhost:8000/api/profile/edit/", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify(data)
        })
        if (api.status === 401){
            window.location.hash = '#/login'
            return
        }
        const dataApi = await api.json()
        
        if (!api.ok)
            throw dataApi
        showFlashNotification('Profile updated successfully', 'success')
    }catch(e){
        if (e.username)
            showFlashNotification(e.username, 'error')
        if (e.last_name)
            showFlashNotification(e.last_name, 'error')
        if (e.first_name)
            showFlashNotification(e.first_name, 'error')
        if (e.email)
            showFlashNotification(e.email, 'error')
        console.error(e)
    }
}

async function createTournament() {
    console.log("creating tournament")
    let container = document.getElementById('tournament-creation')
    if (!container)
        return
    container.style.display = 'flex'
    container.innerHTML = `
        <div class="tournament-creation-container">
            <div class="tournament-creation-title">Create Tournament</div>
            <input type="text" id="tournament-name" class="tournament-creation-input" placeholder="Tournament Name"/>
            
            <label for="tournament-start-date">start date</label>
            <input type="date" id="tournament-start-date" class="tournament-creation-input" placeholder="tournament Start Date"/>    
            
            <label for="tournament-end-date">end date</label>
            <input type="date" id="tournament-end-date" class="tournament-creation-input" placeholder="tournament End Date"/>

            <button class="tournament-creation-button" onclick="submitTournament()">Create</button>
            <button class="tournament-creation-button" onclick="cancelCreateTournament()">Cancel</button>
        </div>
        `
}
async function submitTournament() {

    const startDate = document.getElementById("tournament-start-date").value
    const endDate = document.getElementById("tournament-end-date").value
    const name = document.getElementById("tournament-name").value

    if (!startDate || !endDate || !name){
        showFlashNotification("fill all the form", "error")
        return
    }

    const body = {
        name: name,
        start_date: startDate,
        end_date: endDate
    }
    console.log(body)
    try {
        const response = await fetch('http://localhost:8001/api/tournaments/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    
        if (!response.ok){
            console.log(await response.json())
            throw new Error(response.status)
        }
        const data = await response.json();
        showFlashNotification("tournament created", "info")
        cancelCreateTournament()

        // return data;
        
    } catch (error) {
        console.error(error);
        // return null
    }

}

function cancelCreateTournament (){
    const container  = document.getElementById("tournament-creation")
    if (!container)
        return

    container.style.display = 'none'
}

// async function joinTournament(e){

//     console.log("bhbhhb")
//     document.querySelector('.tournaments').addEventListener('click', function(event) {
//         if (event.target.classList.contains('join-tournament-button')) {
//             const tournamentName = event.target.getAttribute('data-tournament');
//             console.log(`Button clicked for tournament: ${tournamentName}`);
//             joinTournament(tournamentName);
//         }
//     });
//     // console.log(el)
//     return
//     const user = getProfileAuth()
//     const id = document.getElementById("")
    // http://localhost:8001/api/tournaments/Asatir4/register/
    // try {
    //     const api = await fetch('http://localhost:8001/api/tournaments/Asatir4/register/', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: {
    //             username: user.username
    //         }
    //     })
    //     if(!api.ok){
    //         console.log(await api.json()) 
    //         throw new Error(api.statuscode)
    //     }
    //     const data = api.json()

    // } catch (error) {
    //     console.error(error)
    // }
// }