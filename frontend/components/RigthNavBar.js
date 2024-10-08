import {dots } from "../assets/index.js";
import { getProfileAuth } from "../utils/userApis.js";

const getChatUsers = async () => {
    try{
        const res = await fetch("json/chatUsers.json")
        const data = await res.json()
        return data;
    } catch(err){
        console.error(err)
        return null;
    }
}

export const RightNavBar = async () => {
    // const chatUsers = await getChatUsers();

    const user = await getProfileAuth();
    
    return  `
        <div class="rigth-sidebar">
            <div class="icon-container">
                <div onclick="toggleProfile()" class="bg-none pb-4 position-relative">
                    <img src="${user?.avatar || 'assets/images/default.webp'}" alt="icon" class="rounded-circle border-profile-user" width="55px" height="55px">
                    <div class="toggleProfile">
                        <div>
                            <a href="#/profile" class="text-decoration-none"> view profile </a>
                        </div>
                        <div>
                            <a href="#/settings" class="text-decoration-none"> view Settings </a>
                        </div>
                        <div class="btn btn-danger" onclick="logout()"> logout </div>
                    </div>
                </div>
                ${
                    user?.friends.map((friend, index) => {
                        return `
                        <a href="#/profile/${friend?.login}" key=${index} class="iconSideBar position-relative">
                            <img src="${friend?.profile}" alt="${friend?.username}" class="rounded-circle " width="50px" height="50px">
                            ${
                                friend?.isOnline === "true" ?
                                `<img src="${dots[1]}" class="position-absolute dotPosition pe-none" width="70px" height="70px"/>`
                                : 
                                `<img src="${dots[0]}" class="position-absolute dotPosition pe-none" width="70px" height="70px"/>`
                            }
                        </a>
                        `
                    })
                }
            </div>
        </div>
    `
}
// ${
//     chatUsers.users && chatUsers.users.map((user, index) => {
//     }).join("")
// }