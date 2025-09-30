"use client"
import { User } from "@/lib/types/user";
import { useEffect, useState } from "react";


export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
        if(!token){
            setIsLoading(false);
            return
        }
        fetch("api/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then((data)=>{
            if(data.user){
                setUser(data.user);
            }
        })
        } catch (error) {
            console.log(error, "Error in Fetching user");
        } finally {
            setIsLoading(false);
            
        }
        

    }, [])
    return {
        user, setUser, isLoading
    }
}