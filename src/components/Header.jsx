'use client'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
    const { user } = useUser()
    console.log(user);
    
  return (
    <div className='flex justify-end items-center p-4  text-white'>
        <SignedIn >
            <UserButton/>
        </SignedIn>
    </div>
  )
}

export default Header