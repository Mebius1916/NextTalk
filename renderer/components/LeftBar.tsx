import React from 'react'
import Image from 'next/image'
import mebius from '../public/images/mebius.jpg'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CatchingPokemonOutlinedIcon from '@mui/icons-material/CatchingPokemonOutlined';;
import Link from 'next/link';
const LeftBar = () => {
  const home='home';
  return (
    <div className='bg-white w-10 flex flex-col items-center'>
      <Image
        src={mebius}
        width={20}
        height={20}
        alt="mebius"
        className='mt-2'
      />
      <Link href={`/chats/toChat/${home}`}>
        <ChatOutlinedIcon className='mt-10 ' color='disabled' />
      </Link>
      <Link href='/chats/toTalk'>
        <PersonSearchOutlinedIcon className='mt-6' color='disabled' />
      </Link>
      <Link href='/anime/map'>
        <MapOutlinedIcon className='mt-6' color='disabled' />
      </Link>
      <Link href='/'>
        <CatchingPokemonOutlinedIcon className='mt-6' color='disabled' />
      </Link>
    </div>
  )
}

export default LeftBar