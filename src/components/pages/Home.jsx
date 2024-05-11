import React, { useEffect, useState } from 'react'
import { getApartments, getMatched, updateApartment } from '@/lib/firebase/api'
import { toast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { Edit, Loader2 } from 'lucide-react'
import { useUserContext } from '@/context/AuthContext'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

const Home = () => {
    const {isAuth, user} = useUserContext()

    const [apartmentData, setApartmentData] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const getData = async() => {
        setIsLoading(true)
        const data = await getApartments()
        setIsLoading(false)

        if(!data){
            return toast({
                title: "Error",
                description: "Something went wrong while fetching data"
            })
        }

        setApartmentData(data)
    }

    useEffect(() => {
        getData()
    })


  return (
    <div className='px-6 max-w-screen-xl mx-auto py-6 space-y-6'>
        <h1 className='font-bold text-xl'>Apartment Feed</h1>

        {
            apartmentData ? apartmentData.map((apartment, index) => {

                return <Apartmentpost key={index} apartment={apartment} />
            })
            : isLoading ? <Loader2 className='animate-spin mx-auto' /> : null
        }
    </div>
  )
}

export default Home

function Apartmentpost({apartment}){
    const {user, isAuth} = useUserContext()
    const [isMatchedLoading, setMatchedIsLoading] = useState(false)
    const [isEditLoading, setIsEditLoading] = useState(false)
    const [apartmentData, setApartmentData] = useState(apartment)
 
    const isMatching = apartment.isMatching ? apartment.isMatching.includes(user.id) : false

    const handleGetMatched = async(apartmentId, apartmentUnit) => {
        const userData = {
            apartmentId: apartmentId,
            userId: user.id,
            dob: user.dob,
            gender: user.gender,
            religon: user.religon,
            units: parseInt(apartmentUnit),
            name: user.name,
            email: user.email
        }
        setMatchedIsLoading(true)
        const isMatched = await getMatched(userData)
        setMatchedIsLoading(false)

        if(isMatched){
            return toast({
                title: "Matched",
                description: "You have being successfully matched, check you mail for details"
            })
        }else{
            return toast({
                title: "Success",
                description: "Your request have being processed, you will be contacted when you get matched"
            })
        }
    }

    const handleApartmentUpdate = async(e) => {
        e.preventDefault()

        setIsEditLoading(true)
        await updateApartment(apartmentData, apartment.id)
        setIsEditLoading(false)

        return toast({
            title: "Success",
            description: "Apartment updated successfully"
        })
    }

    return (
        <div className='shadow rounded space-y-4 w-full lg:w-[70%] px-3 py-3'>
            {
                user.isAdmin && (
                    <section className='float-right'>
                        <Dialog>
                            <DialogTrigger>
                                <Edit size={18}/>
                            </DialogTrigger>
                            <DialogContent>
                                <form className='space-y-3' onSubmit={handleApartmentUpdate}>
                                    <h1 className='font-bold text-xl'>Edit Apartment</h1>
                                    <div className='space-y-4'>
                                        <label htmlFor="apartment-type" className='font-medium text-md'>Select Apartment Type:</label>
                                        <select 
                                            name="apartment-type" 
                                            className='w-full p-3 border outline-none rounded cursor-pointer' 
                                            id="apartment-type" 
                                            required
                                            onChange={(e) => setApartmentData({...apartmentData, apartmentType: e.target.value})}
                                            defaultValue={apartment.apartmentType}
                                        >
                                            <option value="Duplex">Duplex</option>
                                            <option value="Bungalow">Bungalow</option>
                                        </select>
                                    </div>
                                    <input 
                                        type='number' 
                                        placeholder='Number of rooms' 
                                        className='w-full p-3 border outline-none rounded'  
                                        defaultValue={apartment.roomsNo}
                                        onChange={(e) => setApartmentData({...apartmentData, roomsNo: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type='number' 
                                        placeholder='Rent Amount' 
                                        className='w-full p-3 border outline-none rounded'  
                                        defaultValue={apartment.rent}
                                        onChange={(e) => setApartmentData({...apartmentData, rent: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type='number' 
                                        placeholder='Available Units' 
                                        className='w-full p-3 border outline-none rounded'  
                                        defaultValue={apartment.units}
                                        onChange={(e) => setApartmentData({...apartmentData, units: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type='text' 
                                        placeholder='Description' 
                                        className='w-full p-3 border outline-none rounded'  
                                        defaultValue={apartment.description}
                                        onChange={(e) => setApartmentData({...apartmentData, description: e.target.value})}
                                        required
                                    />
                                    <Button className="w-full" type="submit">
                                        {isEditLoading ? <Loader2 className='animate-spin' /> : "Submit"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </section>
                )
            }
            <img 
                src={apartment.imgUrl} 
                alt={apartment.apartmentType} 
                className='w-full h-auto'
            />
            <p className='font-bold'>{apartment.apartmentType}</p>
            <p className=''>Rent: ₦{apartment.rent}</p>
            <p className=''>Room size: {apartment.roomsNo}</p>
            <p className=''>Available Units: {apartment.units}</p>
            <p>{apartment.description}</p>

            {
                (isAuth && apartment.units !== 0) 
                &&  
                <Button 
                    onClick = {() => handleGetMatched(apartment.id, apartment.units)}
                    disabled = {isMatching}
                >
                    {isMatchedLoading ? <Loader2 className='animate-spin' /> : "Get matched"}
                </Button>
            }
        </div>
    )
}