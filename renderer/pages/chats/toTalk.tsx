'use client'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { SessionData } from '../../lib/type';
import ChatLayout from '../../components/ChatLayout';
import Loader from '../../components/Loader';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { Button, divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {SearchIcon} from "../../components/SearchIcon";
const EarthCanvas =lazy(() => import('../../components/Earth'));
const ToTalk = () => {
  const { data: session } = useSession();
  const currentUser = session?.user as SessionData;

  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<SessionData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [name, setName] = useState("");
  const home='home';
  const isGroup = selectedContacts.length > 1;
  const router = useRouter();

  const getContacts = async () => {
    try {
      const res = await fetch(
        //不查询的时候显示所有用户，查询的时候只显示查询的用户
        search !== "" ? `/api/users/${currentUser._id}/searchContact/${search}/searchUsers` : "/api/users/allUsers"
      );
      const data = await res.json();
      //在所有信息里剔除自己的信息
      setContacts(data.filter((contact: SessionData) => contact._id !== currentUser._id));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (current: never) => {
    //取消选中
    if (selectedContacts.includes(current)) {
      setSelectedContacts(prevSelectedContacts =>
        prevSelectedContacts.filter(item => item !== current)
      );
    } else {
      //选中并确保不重复添加
      setSelectedContacts(prevSelectedContacts => {
        // 如果已经包含，则不再添加
        if (!prevSelectedContacts.includes(current)) {
          return [...prevSelectedContacts, current];
        }
        return prevSelectedContacts;
      });
    }
  };
  

  const createChat = async () => {
    const res = await fetch("/api/chats/toChat", {
      method: "POST",
      body: JSON.stringify({
        //当前用户_id
        currentUserId: currentUser._id,
        //选中成员的_id数组
        members: selectedContacts.map((contact:SessionData) => contact._id),
        //是否是群组
        isGroup,
        //群组名称
        name,
      }),
    });

    if (res.ok) {
      router.push(`/chats/toChat/${home}`);
    }
  };

  useEffect(() => {
    if (!currentUser) router.push("/auth/login");
  }, [session]);

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  return loading ? (
    <Loader />
  ) : (
    <div className='bg-gray-100 h-[calc(100vh-2.25rem)] shadow-inset-top-left flex ' id='home'>
      <div className=' flex-1 box-border '>
        <div className=' h-[calc(100vh-5rem)] mt-3 flex flex-col max-md:w-full  '>
        <Input
              onChange={(e) => setSearch(e.target.value)}
              isClearable
              radius="lg"
              value={search}
              onClear={() => setSearch('')}
              className="rounded-2xl bg-white outline-none w-full  mb-1 ml-1 text-middle"
              placeholder="Type to search..."
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
          <div className='flex flex-row flex-wrap content-start overflow-y-auto h-[calc(100vh-8rem)] ml-3 '>
          
            {contacts.map((current: SessionData, index) => (

              <div
                key={index}
                className="flex items-center cursor-pointer bg-white mt-1 h-12 gap-1 
                  drop-shadow-md border-purple-400 border-1  flex-0 flex-shrink-0 w-three 
                   ml-1 text-ellipsis whitespace-nowrap overflow-hidden"
                onClick={() => handleSelect(current as never)}
              >
                {selectedContacts.find((item) => item === current) ? (
                  <CheckCircle sx={{ color: "purple", fontSize: "small" }} />
                ) : (
                  <RadioButtonUnchecked sx={{ fontSize: "small" }} />
                )}
                <img
                  src={current.image || "/images/person.jpg"}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover object-center"
                />
                <div className='mx-1'>
                  <p className=' font-sans text-smm antialiased font-bold'>{current?.username}</p>
                  <p className=' font-sans text-mm antialiased font-bold text-gray-500'>{current?.email}</p>
                </div>
              </div>

            ))}
          </div>
          <div className='text-center mt-6'>
            <Button 
            color="secondary" 
            variant="shadow" 
            onClick={createChat}
            disabled={selectedContacts.length === 0}
            className='w-3/4 text-smm text-white'>
              FIND OR START A NEW CHAT
            </Button>
          </div>
        </div>
      </div>
      <div className=' flex-1 box-border ml-6'>

        {!isGroup ? (
          <Suspense fallback={<Loader/>}>
            <div className="flex items-center justify-center h-full max-sm:hidden" >
              <EarthCanvas />
           </div>
        </Suspense>
        ) : (
          <>
            <div className=' h-[calc(100vh-3rem)] mt-3 flex flex-col max-sm:hidden'>
              <div className="flex flex-col gap-2 max-sm:hidden">
                <p className="font-sans text-medium antialiased font-bold ">Group Chat Name</p>
                <Input
                  isClearable
                  placeholder="Enter group chat name..."
                  className="  py-3 outline-none text-center  w-3/5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onClear={() => setName('')}
                  variant="bordered"
                />
              </div>

              <div className='flex flex-row flex-wrap content-start overflow-y-auto h-[calc(100vh-8rem)]'>
                {isGroup && (
                  <div className="flex flex-col gap-3 overflow-y-auto h-80">
                    <p className="font-sans text-medium antialiased font-bold">Members</p>
                    <div className="flex flex-row flex-wrap content-start overflow-y-auto gap-2 ">
                      {selectedContacts.map((contact: SessionData, index) => (
                        <p className="text-small-bold p-2 border-1 border-purple-500 rounded-md bg-white" key={index}>
                          {contact.username}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
ToTalk.getLayout = function getLayout(page:any) {
  return (
    <ChatLayout>
      {page}
    </ChatLayout>
  )
}

export default ToTalk