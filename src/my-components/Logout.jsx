import { useNavigate } from "react-router-dom";
import { clearTokens } from "../api/tokenUtils"
import { useEffect } from "react";

export const Logout=()=>{
    const navigate=useNavigate();
    useEffect(()=>{
        clearTokens();
        navigate("/login");
    },[])
    
    
}