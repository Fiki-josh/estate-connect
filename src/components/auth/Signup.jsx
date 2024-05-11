import React,{useEffect, useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from '../ui/use-toast'
import { createNewUser } from '@/lib/firebase/api'
import { Loader2 } from 'lucide-react'
import { getCurrentDate } from '@/lib/helpers'

const Signup = ({setAcct}) => {
    const [userData, setUserData] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

 
    useEffect(() => {
        if(
            userData?.name && emailRegex.test(userData?.email) && userData?.dob && userData?.gender && userData?.gender !== "Select" && userData?.religon && userData?.religon !== "Select" && userData?.password
        ){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [userData])
  async function onSubmit() {

    if(userData?.password.length < 6){
        return toast({
            description: "password must be greater than 5 characters"
        })
    }
    else if(userData?.password !== userData?.confirm_password){
        return toast({
            title: "Error",
            description: "passwords does not match"
        })
    }

    setLoading(true)

    const {isSuccess, isError, errorMsg} = await createNewUser(userData)

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

  const currentDate = getCurrentDate()
  return (
    <ScrollArea className="h-[80vh] md:h-[fit-content] lg:h-[80vh] xl:h-[fit-content] flex items-center justify-center">

        <form 
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
            }} 
            className='py-2 space-y-3'
        >
            <h1 className='font-bold text-2xl'>Create an account</h1>
            <input 
                type='text' 
                placeholder='Full-Name' 
                className='w-full p-3 border outline-none rounded' 
                onChange={(e) => setUserData({...userData, name: e.target.value})} 
            />
            <input 
                type='email' 
                placeholder='Email' 
                className='w-full p-3 border outline-none rounded' 
                onChange={(e) => setUserData({...userData, email: e.target.value})} 
            />
            <input 
                type='password' 
                placeholder='Password' 
                className='w-full p-3 border outline-none rounded' 
                onChange={(e) => setUserData({...userData, password: e.target.value})}
            />
            <input 
                type='password' 
                placeholder='Confirm Password' 
                className='w-full p-3 border outline-none rounded' 
                onChange={(e) => setUserData({...userData, confirm_password: e.target.value})} 
            />
            <div className='space-y-2'>
                <label htmlFor="dob" className='font-medium text-md'>Select DOB:</label>
                <input 
                    type='date' 
                    id='dob' 
                    max={currentDate}
                    className='w-full p-3 border outline-none rounded' 
                    onChange={(e) => setUserData({...userData, dob: e.target.value})} 
                />
            </div>
            <div className='space-y-2'>
                <label htmlFor="gender" className='font-medium text-md'>Select Gender:</label>
                <select name="gender" className='w-full p-3 border outline-none rounded' id="gender" onChange={(e) => setUserData({...userData, gender: e.target.value})}>
                    <option>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className='space-y-2'>
                <label htmlFor="religon" className='font-medium text-md'>Select Religon:</label>
                <select name="religon" className='w-full p-3 border outline-none rounded' id="religon" onChange={(e) => setUserData({...userData, religon: e.target.value})} >
                    <option>Select</option>
                    <option value="Christian">Christian</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Traditional Worshipper">Traditional Worshipper</option>
                    <option value="Atheist">Atheist</option>
                </select>
            </div>
            <Button className="w-full" disabled={disabled}>{loading ? <Loader2 className='animate-spin' /> : "Submit"}</Button>
            <p 
                className='text-sm'
            >
                Already have and account? <span className=' text-blue-400 cursor-pointer' onClick={() => setAcct(true)}>Login</span>
            </p>
        </form>
    </ScrollArea>
  )
}

export default Signup