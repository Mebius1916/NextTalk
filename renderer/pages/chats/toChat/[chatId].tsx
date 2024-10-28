'use client'
import React, { useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react";
import { useParams, useRouter } from 'next/navigation'
import { SessionData } from '../../../lib/type';
import ChatLayout from '../../../components/ChatLayout';
import Loader from '../../../components/Loader';
import ChatBox from '../../../components/ChatBox';
import { Input } from '@nextui-org/react';
import { SearchIcon } from '../../../components/SearchIcon';
import Image from 'next/image';
import grid2 from '../../../public/images/grid2.png';
import ChatDetails from '../../../components/ChatDetails';

import { pusherClient } from '../../../lib/pusher';
import { ToastContainer } from 'react-toastify';
const Chat = () => {
  const { chatId } = useParams()?? { chatId: 'home' };
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const currentChatId = chatId.toString();
  const currentUser = session?.user as SessionData;
  const router = useRouter();

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== ""
          ? `/api/users/${currentUser?._id}/searchChat/${search}/searchChat`
          : `/api/users/${currentUser?._id}/allChats`
      );
      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!currentUser) router.push("/auth/login");
  }, [session]);

  //每次当前用户、搜索更新时，重新获取所有聊天
  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);
  useEffect(() => {
    if (currentUser) {
      //订阅有关自己的更新
      pusherClient.subscribe(currentUser._id);
      const handleChatUpdate = (updatedChat: any) => {
        setChats((allChats: any) =>
          allChats.map((chat: any) => {
            // 匹配当前的聊天_id
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
        const firstChat = chats.find((c:any) => c._id === updatedChat.id);
        if (firstChat) {
          setChats([firstChat,...chats.filter((c:any) => c._id!== updatedChat.id)]);
        }
      };

      const handleNewChat = (newChat: any) => {
        setChats((allChats) => [...allChats, newChat] as any);
      }
      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);
      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <>
    <ToastContainer position="top-center" />
    <div className='bg-gray-100 h-[calc(100vh-2.25rem)] shadow-inset-top-left flex' id='home'>
      {/* chatList */}
      <div className='mt-4'>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          isClearable
          radius="none"
          onClear={() => setSearch('')}
          value={search}
          className=" bg-white outline-none text-middle w-64 ml-4 mr-2 mb-2"
          placeholder="Type to search..."
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
        />
        <div className='h-[calc(100vh-7.155rem)] ml-4 mr-2 w-64 overflow-y-auto'>

          {chats?.map((chat:any, index) => (
            <div className='relative' key={chat?._id}>
              <ChatBox 
                chat={chat}
                key={index}
                currentUser={currentUser as SessionData}
                currentChatId={currentChatId}
              />
              {/* <div className='absolute right-2 top-[1.4rem] opacity-40' onClick={(e) => handleClick(e, chat)}>
                    <HighlightOffOutlinedIcon sx={{ fontSize: 15,pointerEvents: 'auto',color:'disabled' }} />
              </div> */}
            </div>
          ))}
        </div>
      </div>
      <div className='flex-1 max-sm:hidden'>
        {/* chatContact */}
        <div className='bg-white h-[calc(100vh-4.2rem)] ml-2 mr-4 mt-4 drop-shadow-md items-center flex overflow-y-auto'>
          {chatId === 'home' ? (
            <Image
              src={grid2}
              width={400}
              height={400}
              alt='grid2'
              className='mx-auto'
            />
          ) : (
            <div className='flex-1'>
              <ChatDetails chatId={currentChatId}/>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
Chat.getLayout = function getLayout(page: any) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}

export default Chat