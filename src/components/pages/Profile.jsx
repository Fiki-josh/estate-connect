import { useUserContext } from '@/context/AuthContext'
import { Edit, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from '../ui/scroll-area'
import { getCurrentDate } from '@/lib/helpers'
import { Button } from '../ui/button'
import { updateUserProfile } from '@/lib/firebase/api'

const Profile = () => {
    const {user} = useUserContext()
    const [userState, setUserState] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const currentDate = getCurrentDate()

    async function handleSubmit(e){
        e.preventDefault()
        const userData = {
            name: (userState.name && userState.name !== user.name) ? userState.name : user.name,
            email: (userState.email && userState.email !== user.email) ? userState.email : user.email,
            dob: (userState.dob && userState.dob?.split("-")[0] !== user.dob) ? userState.dob?.split("-")[0] : user.dob,
            religon: (userState.religon && userState.religon !== user.religon) ? userState.religon : user.religon,
            gender: (userState.gender && userState.gender !== user.gender) ? userState.gender : user.gender,
            id: user.id
        }
        setIsLoading(true)
        await updateUserProfile(userData)
        setIsLoading(false)

        window.location.reload()
    }
  return (
    <div className='px-6 max-w-screen-xl mx-auto py-6 space-y-6 border shadow flex flex-wrap justify-between items-start'>
        <div className='space-y-3'>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Year of Birth: {user.dob}</p>
            <p>Religion: {user.religon}</p>
            <p>Gender: {user.gender}</p>
        </div>
        <Dialog>
            <DialogTrigger>
                <Edit size={15} />
            </DialogTrigger>
            <DialogContent>
                <ScrollArea className="h-[80vh] md:h-[fit-content] lg:h-[80vh] xl:h-[fit-content] flex items-center justify-center"> 
                    <form className='space-y-3 w-full py-2' onSubmit={handleSubmit}>
                        <h1 className='font-bold text-xl'>Edit Profile</h1>
                        <div className='space-y-2'>
                            <label htmlFor="name" className='font-medium text-md'>Name:</label><br />
                            <input 
                                name='name' 
                                id='name' 
                                className='border px-2 py-2 w-full outline-none' 
                                type="text" 
                                defaultValue={user.name} 
                                required
                                onChange={(e) => setUserState({...userState, name: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="email" className='font-medium text-md'>Email:</label><br />
                            <input 
                                name='email' 
                                id='email' 
                                className='border px-2 py-2 w-full outline-none' 
                                type="text" 
                                defaultValue={user.email} 
                                required
                                onChange={(e) => setUserState({...userState, email: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="dob" className='font-medium text-md'>Year of Birth:</label><br />
                            <input 
                                name='dob' 
                                id='dob' 
                                className='border px-2 py-2 w-full outline-none' 
                                type="date" 
                                max={currentDate} 
                                required
                                onChange={(e) => setUserState({...userState, dob: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="religion" className='font-medium text-md'>Religon:</label><br />
                            <input 
                                name='religion' 
                                id='religion' 
                                className='border px-2 py-2 w-full outline-none' 
                                type="text" 
                                defaultValue={user.religon} 
                                required
                                onChange={(e) => setUserState({...userState, religon: e.target.value})}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="gender" className='font-medium text-md'>Gender:</label>
                            <select 
                                name="gender" 
                                className='w-full p-3 border outline-none rounded' 
                                id="gender" 
                                defaultValue={user.gender}
                                required
                                onChange={(e) => setUserState({...userState, gender: e.target.value})}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <Button className = "w-full" type="submit">
                            {isLoading ? <Loader2 className='animate-spin' /> : "Submit"}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default Profile