import React from 'react'
import { Button } from '../ui/button'

const ErrorFallBack = ({error}) => {
    const reload = () => window.location.reload()
  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center border space-y-3'>
        <h1 className='font-bold text-xl'>It's looks like an error occured. Click the button below to reload the application</h1>
        <Button onClick={reload}>Continue</Button>
    </div>
  )
}

export default ErrorFallBack