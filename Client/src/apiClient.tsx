import { AnalyserData, LoginFormData, RegisterFormData, RoutineData, feature_list } from "../../Server/shared/types";
// import Cookies from 'js-cookie'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const FLASK_SERVER_BASE_URL = import.meta.env.VITE_FLASK_SERVER_BASE_URL || ""

//auth related fetches
export const createNewUser = async (form_data : RegisterFormData) => {
    const body = {
        "emailID" : form_data.emailID,
        "password" : form_data.password,
        "createdAt" : new Date(),
        "profile" : {
            "fName" : form_data.fName,
            "lName" : form_data.lName,
            "skinType" : form_data.skinType,
            "skinConcerns" : form_data.skinConcerns
        }
    }
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method : "POST",
        credentials : "include",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    });

    const responseBody = await response.json();
    if(!response.ok){
        throw new Error(responseBody);
    }
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {credentials : "include"});
    if(!response.ok){
        throw new Error("Your session has expired")
    }

    return response.json();
}

export const login = async (form_data : LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        credentials : "include",
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(form_data)
    })

    if(!response.ok){
        console.log(response.json())
        throw new Error("Something went wrong")
    }

    return response.json();
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {credentials : "include", method : "POST"})
    if(!response.ok){
        throw new Error("Error during sign out")
    }
    return response.json()
}

export const fetchCurrentUser = async() => {
    const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        credentials : "include"
    })

    if(!response.ok){
        throw new Error("Error fetching user details")
    }

    return response.json();
}

//routine route fetches
export const createNewRoutine = async (routine : RoutineData) => {
    const response = await fetch(`${API_BASE_URL}/api/routine/new`, {
        credentials:"include",
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(routine)
    })

    if(!response.ok){
        throw new Error("Something went wrong")
    }

    return response.json();
}

export const fetchAllRoutines = async () => {
    const response = await fetch(`${API_BASE_URL}/api/routine`, {
        credentials : "include"
    })

    if(!response.ok){
        throw new Error("Something went wrong")
    }

    return response.json();
}

export const deleteRoutine = async (routineID : string) => {
    console.log(routineID)
    const response = await fetch(`${API_BASE_URL}/api/routine/delete/:${routineID}`)

    if(!response.ok){
        throw new Error("Something went wrong")
    }

    return response.json()
}


//recommendation system results fetch
export const recommend = async (data : AnalyserData) => {
    let vector = []
    const skin = feature_list.indexOf(data.skinType)
    // console.log("Skin type idx" + skin + " " + data.skinType)
    for(let i = 0; i<5; i++){
        if(skin == i) vector.push(1)
        else vector.push(0);
    }

    for(let i = 5; i<feature_list.length; i++){
        if(data.concerns.includes(feature_list[i])){
            vector.push(1);
        } else {
            vector.push(0);
        }
    }

    const response = await fetch(`${API_BASE_URL}/api/analyser/recommend_products`, {
        credentials: "include",
        method: "POST",
        body : JSON.stringify(vector),
        headers : {
            "Content-Type" : "application/json",
        }
    });


    if(!response.ok){
        throw new Error("Something went wrong")
    }

    return response.json();
}