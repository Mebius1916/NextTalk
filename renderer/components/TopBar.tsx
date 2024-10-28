import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { SessionData } from '../lib/type';
import { Logout } from '@mui/icons-material';
const handleLogout = () => {
  signOut({ callbackUrl: '/auth/login' });
}
const TopBar = () => {
  const { data: session } = useSession();
  const user = session?.user as SessionData | null;
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageError = () => {
    if (imageRef.current) {
      imageRef.current.src = user?.image || "/images/person.jpg";
    }
  };

  useEffect(() => {

    if (imageRef.current) {
      imageRef.current.onerror = handleImageError;//给onerror绑定处理函数

    }
  }, [user?.image]);

  return (
    <>
    <div className='bg-white h-9 border-l-1 flex justify-between border-gray-300'>

          <p className='text-center mt-2 ml-2 font-sans text-small antialiased font-bold'>NextTalk</p>
          <div className='flex'>
            <Link rel="stylesheet" href="/chats/profile">
              <img
                ref={imageRef}
                src={user?.image || "/images/person.jpg"}
                alt="image"
                className="w-8 h-8 rounded-full mt-[2px]" 
              />
            </Link>
            
            <div className='mx-4'>
              <p className='text-center font-sans text-small antialiased font-bold'>{user?.username}</p>
              <p className='text-center font-sans text-mm antialiased font-bold text-gray-500'>{user?.email}</p>
            </div>
            <Logout sx={{ color: "#737373", cursor: "pointer" }} onClick={handleLogout} className='mt-1 mr-4'/>
          </div>
        </div>
      </>
  )
}
export default TopBar
