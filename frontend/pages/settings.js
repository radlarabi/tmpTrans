import { getProfileAuth } from "../utils/userApis.js"
import { getCookie } from "../layers.js"
import { profile } from "./profile.js"

async function gameSettings () {
    return `
        <div>game settings</div>
    `
}
async function securitySettings () {


    return `
        <div>
            <h3>Security Settings</h3>
            <div class="profileSettingForm align-items-center">

                <div class="input-group-profile-settings">
                    <label class="labelProfileSettings" for="old_password">Old Password</label>
                    <input class="inputProfileSettings" type="text" id="old_password" name="old_password" placeholder="Old Password">
                </div>                

                <div class="input-group-profile-settings">
                    <label class="labelProfileSettings" for="new_password">New Password</label>
                    <input class="inputProfileSettings" type="text" id="new_password" name="new_password" placeholder="New Password">
                </div>

                <div class="input-group-profile-settings">
                    <label class="labelProfileSettings" for="confirm_new_password">Confirm New Password</label>
                    <input class="inputProfileSettings" type="text" id="confirm_new_password" name="confirm_new_password" placeholder="Confirm New Password">
                </div>

                <div class="w-100 d-flex justify-content-end gap-3">
                    <button type="submit" class="button-card" onclick="editPassword()">Save</button>
                    <button type="submit" class="button-card cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    `
}

async function profileSettings (user) {

    return `
    <div>
        <h3>Profile Settings</h3>
        <div class="profileSettingForm align-items-center">
            
            <div class="d-flex flex-column  flex-md-row gap-3">
                <div class="input-group-profile-settings">
                    <label class="labelProfileSettings" for="first_name">First Name</label>
                    <input class="inputProfileSettings" type="text" id="first_name" name="first_name" placeholder="First Name" value="${user && user.first_name}">
                </div>                

                <div class="input-group-profile-settings">
                    <label class="labelProfileSettings" for="last_name">Last Name</label>
                    <input class="inputProfileSettings" type="text" id="last_name" name="last_name" placeholder="Last Name" value="${user && user.last_name}">
                </div>
            </div>
        
            <div class="input-group-profile-settings">
                <label class="labelProfileSettings" for="username">Username</label>
                <input class="inputProfileSettings" type="text" id="username" name="username" placeholder="Username" value="${user && user.username}">
            </div>

            <div class="input-group-profile-settings">
                <label class="labelProfileSettings">Email address</label>
                <input autocomplete="off" name="Email" id="emailProfileSetings" class="inputProfileSettings" type="email" placeholder="Email" value="${user && user.email}"/>
            </div>

            <div class="d-flex justify-content-end gap-3">
                <button type="submit" class="button-card" onclick="editProfile()">Save</button>
                <button type="submit" class="button-card cancel-button">Cancel</button>
            </div>
        </div>


    </div>
    `
}

document.addEventListener('click', async (e) => {
    if (e.target.id === 'settings-switch-button-checkbox1') {
        
        const user = await getProfileAuth()
        document.querySelector(".settings-content").innerHTML  = await profileSettings(user)
        document.querySelector(".switch-button-layer-settings").style.left = "0%"
        
        // need to check if the email is a 1337 student email
    
        // const email = document.getElementById('emailProfileSetings')
        // if (email.value.includes('@student.1337.ma')) {
        //     email.disabled = true
        //     email.style.cursor = 'not-allowed'
        // }
    }
    else if (e.target.id === 'settings-switch-button-checkbox2') {
        document.querySelector(".settings-content").innerHTML = await securitySettings()
        document.querySelector(".switch-button-layer-settings").style.left = "31%"
    }
    else if (e.target.id === 'settings-switch-button-checkbox3') {
        document.querySelector(".settings-content").innerHTML = await gameSettings()
        document.querySelector(".switch-button-layer-settings").style.left = "61%"
    }
})

export const settings = async () => {

    window.location.hash = '#/settings'
    const user = await getProfileAuth()

    return `
        <div class="text-white w-100 my-3 mx-2">
            <h1>Settings</h1>
            <div class="w-100 settings-header py-3">
                <img src="https://via.placeholder.com/150" class="rounded-circle" alt="profile picture">
                <h3>Username</h3>
                
                <div class="switch-button">
                    <div class="switch-button-layer-settings"></div>
                    <button id="settings-switch-button-checkbox1">profile</button>
                    <button id="settings-switch-button-checkbox2">security</button>
                    <button id="settings-switch-button-checkbox3">game</button>
                </div>
            </div>

            <div class="w-100 settings-content p-3">
                ${await profileSettings(user)}        
            </div>
        </div>
    `
}