import React, { useEffect, useState } from 'react'
import ChatLayout from '../../components/ChatLayout'
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SessionData } from '../../lib/type';
const map = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as SessionData;
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) router.push("/auth/login");
  }, [session]);
  const [animeMap, setAnimeMap] = useState("https://anitabi.cn/map");
  const refresh = () =>{
    setAnimeMap("https://anitabi.cn/map");
    router.reload();
  }
  return (
    <>
      <iframe
        title="Map"
        src={animeMap}
        width="100%"
        height="100%"
        allowFullScreen
        className='h-[calc(100vh-2.25rem)] w-full border-0 relative z-0'
      />
      <div className='absolute w-6 h-6 z-10 bottom-52 right-3 bg-white drop-shadow-md rounded' onClick={refresh}>
        <RefreshIcon className='mb-1'/>
      </div>
    </>
  )
}
map.getLayout = function getLayout(page:any) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}
export default map