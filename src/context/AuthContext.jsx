import { getCurrentUser } from "@/lib/firebase/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const INITIAL_USER = {
    id: "",
    name: "",
    email: "",
    dob: "",
    gender: "",
    religon: "",
    isAdmin: false
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isAuth: false
}


const AuthContext = createContext(INITIAL_STATE)

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(INITIAL_USER)
    const [isAuth, setIsAuth] = useState(false)

    const {pathname} = useLocation()
    const navigate = useNavigate()

    const checkAuth = async () => {
        const userData = await getCurrentUser()

        if(userData){
            setUser({
                id: userData?.data().id,
                name: userData?.data().name,
                email: userData?.data().email,
                dob: userData?.data().dob,
                gender: userData?.data().gender,
                religon: userData?.data().religon,
                isAdmin: userData?.data().isAdmin
            })

            setIsAuth(true)
        }else{
            setIsAuth(false)
        }
    }

    useEffect(() => {
        checkAuth()

        if(!isAuth && pathname !== "/" && pathname !== "/about") navigate("/")
    },[isAuth, pathname])

    return (
        <AuthContext.Provider value={{user, isAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)

