import React,{useState} from 'react'
import { useUserContext } from '../../context/AuthContext'
import { adminNavLinks, navLinks } from '../../../constants'
import { Link, useLocation } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Signup from '../auth/Signup'
import { Blend } from 'lucide-react'
import SignIn from '../auth/SignIn'
import { ErrorBoundary } from 'react-error-boundary'
import { LogOut } from 'lucide-react'
import { handleSignOut } from '@/lib/firebase/api'
import { toast } from '../ui/use-toast'
import ForgotPassword from '../auth/ForgotPassword'
import AdminSignin from '../auth/AdminSignin'
  

const NavBar = () => {
    const [toggle, setToggle] = useState(false)
    const [acct, setAcct] = useState(false)
    const [forgot, setForgot] = useState(false)
    const [admin, setAdmin] = useState(false)

    const {pathname} = useLocation()
    const {user, isAuth} = useUserContext()

    const signOutUser = async() => {
        await handleSignOut()

        window.location.reload()

        return toast({
            description: "User signed out successfully"
        })
    }

    const auth = (
        <Dialog>
            <DialogTrigger>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Get started</button>
            </DialogTrigger>
            <DialogContent>
                <ErrorBoundary fallback={<>Something went wrong</>}>
                    {
                        !acct 
                        ? 
                        <Signup setAcct={setAcct} setAdmin={setAdmin} /> 
                        : forgot 
                        ? <ForgotPassword setForgot={setForgot} /> 
                        : admin 
                        ? <AdminSignin setAdmin={setAdmin} setForgot={setForgot} /> 
                        :<SignIn setAcct={setAcct} setForgot={setForgot} />
                    }
                </ErrorBoundary>
            </DialogContent>
        </Dialog>

    )
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <span className="flex items-center space-x-3 rtl:space-x-reverse">
                <Blend size={25} />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Homeshare</span>
            </span>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                {
                    !isAuth
                    ?
                    auth
                    : <LogOut size={20} onClick={signOutUser} className='cursor-pointer mt-[.65rem] md:mt-0' />
                }
                <button 
                    data-collapse-toggle="navbar-cta" 
                    type="button" 
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onClick={() => setToggle(!toggle)} 
                    aria-controls="navbar-cta" 
                    aria-expanded="false"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
            </div>
            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                    {
                        user.isAdmin
                        ?
                        adminNavLinks.map((link, index) => {
                            const isPath = pathname === link.to 
                            return (
                                <Link to={link.to} key={index}>
                                    <span className={`block py-2 px-3 md:p-0 ${isPath? "text-blue-700" : "text-gray-900"} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 cursor-pointer `}>{link.link}</span>
                                </Link>
                            )
                        })
                        :
                        navLinks.map((link, index) => {
                            const isPath = pathname === link.to 
                            return (
                                <Link to={link.to} key={index}>
                                    <span className={`block py-2 px-3 md:p-0 ${isPath? "text-blue-700" : "text-gray-900"} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 cursor-pointer`}>{link.link}</span>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
            <div className={`w-[100%] h-[fit-content] ${toggle? "block": "hidden"} lg:hidden`}>
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                    {
                        user.isAdmin
                        ?
                        adminNavLinks.map((link, index) => {
                            const isPath = pathname === link.to 
                            return (
                                <Link to={link.to} key={index}>
                                    <span className={`block py-2 px-3 md:p-0 ${isPath? "text-white bg-blue-700" : "text-gray-900 hover:bg-gray-100"} rounded`} aria-current="page">{link.link}</span>
                                </Link>
                            )
                        })
                        :
                        navLinks.map((link, index) => {
                            const isPath = pathname === link.to 
                            return (
                                <Link to={link.to} key={index}>
                                    <span className={`block py-2 px-3 md:p-0 ${isPath? "text-white bg-blue-700" : "text-gray-900 hover:bg-gray-100"} rounded`} aria-current="page">{link.link}</span>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    </nav>

  )
}

export default NavBar