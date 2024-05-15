import React,{useState, useEffect} from 'react'
import { toast } from '../ui/use-toast'
import { uploadApartmentDetails } from '@/lib/firebase/api'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext'

const CreateApartment = () => {
    const {user} = useUserContext()

    const [apartmentData, setApartmentData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(!user.isAdmin){
            navigate("/")
        }
        console.log(apartmentData)
    },[apartmentData])

    const handleSubmit = async(e) => {
        e.preventDefault()

        if(apartmentData.apartmentType === "Select" || !apartmentData.apartmentType){
            return toast({
                title: "Missing field",
                description: "All fields are required"
            })
        }

        setIsLoading(true)

        const apartment = await uploadApartmentDetails(apartmentData)

        setIsLoading(false)

        if(!apartment){
            return toast({
                title: "Error",
                description: "Something went wrong"
            })
        }
        
        navigate("/")
        return toast({
            title: "Success",
            description: "Apartment created successfully"
        })
    }
  return (
    <form className='px-6 max-w-screen-xl mx-auto py-6 space-y-6' onSubmit={handleSubmit}>
        <div className='space-y-4'>
            <label htmlFor="apartment-type" className='font-medium text-md'>Select Apartment Type:</label>
            <select name="apartment-type" className='w-full p-3 border outline-none rounded cursor-pointer' id="apartment-type" onChange={(e) => setApartmentData({...apartmentData, apartmentType: e.target.value})} required>
                <option>Select</option>
                <option value="Duplex">Duplex</option>
                <option value="Bungalow">Bungalow</option>
            </select>
        </div>
        <input 
            type='number' 
            placeholder='Number of rooms' 
            className='w-full p-3 border outline-none rounded'  
            onChange={(e) => setApartmentData({...apartmentData, roomsNo: e.target.value})}
            required
        />
        <input 
            type='number' 
            placeholder='Rent Amount' 
            className='w-full p-3 border outline-none rounded'  
            onChange={(e) => setApartmentData({...apartmentData, rent: e.target.value})}
            required
        />
        <input 
            type='number' 
            placeholder='Available Units' 
            className='w-full p-3 border outline-none rounded'  
            onChange={(e) => setApartmentData({...apartmentData, units: e.target.value})}
            required
        />
        <input 
            type='text' 
            placeholder='Description' 
            className='w-full p-3 border outline-none rounded'  
            onChange={(e) => setApartmentData({...apartmentData, description: e.target.value})}
            required
        />
        <div className='space-y-4'>
            <label htmlFor="upload-image" className='font-medium text-md'>Upload Image Thumbnails:</label>
            <input 
                type='file' 
                placeholder='' 
                accept='.jpg,.png,.jpeg,.svg'
                className='w-full p-3 border outline-none rounded'
                id='upload-image'  
                onChange={(e) => setApartmentData({...apartmentData, imgFile: e.target.files[0]})}
                required
            />
        </div>
        <div className='space-y-4'>
            <label htmlFor="upload-images" className='font-medium text-md'>Upload Other Images:</label>
            <input 
                type='file' 
                placeholder='' 
                accept='.jpg,.png,.jpeg,.svg'
                className='w-full p-3 border outline-none rounded'
                id='upload-images'  
                onChange={(e) => setApartmentData({...apartmentData, imgFiles: Array.from(e.target.files)})}
                required
                multiple
            />
        </div>
        <Button type='submit'>{isLoading ? <Loader2 className='animate-spin' /> : "Submit"}</Button>
    </form>
  )
}

export default CreateApartment