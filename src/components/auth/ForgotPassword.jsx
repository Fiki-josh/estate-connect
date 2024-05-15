import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { resetPassword } from '@/lib/firebase/api'
import { Loader2 } from 'lucide-react'

const ForgotPassword = ({setForgot}) => {
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")

    useEffect(() => {
        if(email){
            setDisabled(false)
            console.log(email)
        }

        else setDisabled(true)
    },[email])

    async function onSubmit(){
        setLoading(true)

        await resetPassword(email)
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
        <h1 className='font-bold text-2xl'>Forgot your password</h1>
        <p>Enter your email to reset your password.</p>
        <input type='email' required placeholder='Email' className='w-full p-3 border outline-none rounded' onChange={(e) => setEmail(e.target.value)} />

        <Button className="w-full" disabled={disabled}>{loading ? <Loader2 className='animate-spin' /> : "Submit"}</Button>
        <p>Go to <span className=' text-blue-400 cursor-pointer' onClick={() => setForgot(false)}>Login</span></p>
    </form>
  )
}

export default ForgotPassword