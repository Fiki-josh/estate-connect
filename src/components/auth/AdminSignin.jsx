import React,{useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { toast } from '../ui/use-toast'
import { Loader2 } from 'lucide-react'
import { signInAdmin } from '@/lib/firebase/api'

const AdminSignin = ({setAdmin, setForgot}) => {
    const [userData, setUserData] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

 
    useEffect(() => {
        if(
            emailRegex.test(userData?.email) && userData?.password
        ){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [userData])
  async function onSubmit() {
    setLoading(true)
    
    await signInAdmin(userData)

    setLoading(false)
  }
  return (
    
    <form 
        onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
        }} 
        className='py-2 space-y-3'
    >
        <h1 className='font-bold text-2xl'>Admin Login</h1>
        <input type='email' placeholder='Email' required className='w-full p-3 border outline-none rounded' onChange={(e) => setUserData({...userData, email: e.target.value})} />
        <input type='password' placeholder='password' required className='w-full p-3 border outline-none rounded' onChange={(e) => setUserData({...userData, password: e.target.value})} />
        
        <p 
            className=' float-right text-blue-400 cursor-pointer'
            onClick={() => setForgot(true)}
        >
            Forgotten password
        </p>
        <Button className="w-full" disabled={disabled}>{loading ? <Loader2 className='animate-spin' /> : "Submit"}</Button>
        <p>Back to user login <span className=' text-blue-400 cursor-pointer' onClick={() => setAdmin(false)}>Back</span></p>
    </form>
  )
}

export default AdminSignin