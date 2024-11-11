import { getCookie } from '../layers.js';
import { tournamentMap } from '../components/tournamentMap.js'
export const getUser = async (user) => {
    try{
        const res = await fetch(`http://localhost:8000/api/profile/${user}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            }
        })
        if (res.status === 401){
            window.location.hash = '#/login'
            return
        }
        if (!res.ok){
            throw new Error(res.status)
        }
        const data = await res.json()
        return data
    }catch(error){
        return null
    }
}
export const getProfileAuth = async () => {
    // console.log(window.location.hash)
    if (window.location.hash === "" || window.location.hash === "#/"){
        return null
    }
    try{
        // console.log("get profile autg")
        const res = await fetch("http://localhost:8000/api/profile/details/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            }
        })
        if (res.status === 401){
            window.location.hash = '#/login'
            return
        }
        if (!res.ok){
            throw new Error(res.status)
        }
        const data = await res.json()

        return data;
    }
    catch(err){
        // console.error(err)
        return null;
    }
}

export const joingTournament = async (id) => {
    console.log("join")
    // document.querySelector('.tournament-container').innerHTML = await tournamentMap(id);

    // return 
    const user = await getProfileAuth()
    // const id = document.getElementById("")
    // http://localhost:8001/api/tournaments/Asatir4/register/
    try {
        const api = await fetch(`http://localhost:8001/api/tournaments/${id}/register/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({
                username: user.username
            })
        })
        if(!api.ok){
            console.log(await api.json()) 
            throw new Error(api.statuscode)
        }
        const data = api.json()
        // console.log(data)
        // console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
        showFlashNotification(`You joined the tournaments ${id}`, "info")
        // console.log(document.querySelector('.tournament-container'))
        // console.log(await tournamentMap(id))

        document.querySelector('.tournament-container').innerHTML = await tournamentMap(id);
    } catch (error) {
        console.error(error)
    }
} 