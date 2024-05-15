import { useUserContext } from '@/context/AuthContext'
import { getApartment, getMatched } from '@/lib/firebase/api'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

const ApartmentDetails = () => {
    const {id} = useParams()

    const {user,isAuth} = useUserContext()

    const [apartment, setApartment] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isPending, setIsPending] = useState(true)
    const [isMatchedLoading, setMatchedIsLoading] = useState(false)

    async function getData(){
        setIsPending(false)
        setIsLoading(true)

        const apartmentData = await getApartment(id)

        setApartment(apartmentData)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    },[])

    const isMatching = apartment?.isMatching ? apartment?.isMatching.includes(user.id) : false

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

  return (
    <div className='px-6 max-w-screen-xl mx-auto py-6 space-y-6'>
        <h1 className='font-bold text-xl'>Apartment Details</h1>
        {
            (isLoading || isPending)
            &&
            <Loader2 className='animate-spin mx-auto' />
        }
        {
            (!isLoading && !isPending)
            &&
            (
                <div className='space-y-6'>
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

                    {apartment.urls && <h1 className='font-bold text-xl'>More Images</h1>}
                    {apartment?.urls?.map(url => (
                        <img key={url} src={url} alt="aparment -image" className='w-full h-auto'/>
                    ))}

                </div>
            )
        }
    </div>
  )
}

export default ApartmentDetails