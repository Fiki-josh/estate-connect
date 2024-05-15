import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useUserContext } from '@/context/AuthContext'
import { sendFeedback } from '@/lib/firebase/api'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from '../ui/use-toast'

const Feedback = () => {
    const {user} = useUserContext()
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    async function onSubmit(e){
        e.preventDefault()

        const data = {
            name: user.name,
            email: user.email,
            message: message
        }
        setIsLoading(true)
        const response = await sendFeedback(data)
        setIsLoading(false)

        if(response){
            navigate("/")
            return toast({
                title: "Success",
                description: "Your message have been successfully sent."
            })
        }else{
            return toast({
                title: "Error",
                description: "Something went wrong."
            })
        }
    }

  return (
    <form onSubmit={onSubmit}>
        <div className='px-6 max-w-screen-xl mx-auto py-6 space-y-6'>
            <h1 className='font-bold text-xl'>Share Your Thoughts: Help Us Serve You Better!</h1>
            <textarea 
                type='text' 
                required placeholder='Send us a message' 
                className='w-full p-3 h-[200px] border outline-none rounded'
                onChange={(e) => setMessage(e.target.value)} 
            />
            <Button type="submit" >
                {isLoading ? <Loader2 className='animate-spin' /> : "Submit"}
            </Button>
        </div>
    </form>
  )
}

export default Feedback