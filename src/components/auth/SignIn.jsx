import React,{useEffect, useState} from 'react'
import { Button } from "@/components/ui/button"
import { signInUser } from '@/lib/firebase/api'
import { toast } from '../ui/use-toast'
import { Loader2 } from 'lucide-react'

const SignIn = ({setAcct}) => {
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
    
    const {isSuccess, isError, errorMsg} = await signInUser(userData.email, userData.password)

    if(isSuccess){
        setLoading(false)
        window.location.reload()
        return toast({
            description: "Success"
        })
    }
    else if(isError){
        setLoading(false)
        return toast({
            description: errorMsg
        })
    }
  }
  return (
    
    <form 
        onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
        }} 
        className='py-2 space-y-3'
    >
        <h1 className='font-bold text-2xl'>Log into your account</h1>
        <input type='email' placeholder='Email' className='w-full p-3 border outline-none rounded' onChange={(e) => setUserData({...userData, email: e.target.value})} />
        <input type='password' placeholder='password' className='w-full p-3 border outline-none rounded' onChange={(e) => setUserData({...userData, password: e.target.value})} />
        
        <Button className="w-full" disabled={disabled}>{loading ? <Loader2 className='animate-spin' /> : "Submit"}</Button>
        <p>Don't have an account? <span className=' text-blue-400 cursor-pointer' onClick={() => setAcct(false)}>Signup</span></p>
    </form>
  )
}

export default SignIn