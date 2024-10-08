import { getCookie } from '../layers.js';

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