//在当前页面开始向Chat模型个体添加Message个体_id
// 在当前页面开始向Chat模型个体添加Message个体_id
"use client";
import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import { AddPhotoAlternate } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CldUploadButton } from "next-cloudinary";
import MessageBox from "./MessageBox";
// import { pusherClient } from "@/lib/pusher";
import { messageData, SessionData, chatData } from "../lib/type";
import { pusherClient } from "../lib/pusher";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
const ChatDetails = ({ chatId }: { chatId: string }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState<chatData>({
    _id: '',
    members: [],
    messages: [],
    isGroup: false,
    createdAt: new Date(),
    lastMessageAt: new Date(),
  });
  const messageLength = chat?.messages[chat?.messages.length - 1] as any
  const [lastMessage, setLastMessage] = useState(chat?.messages?.length > 0 && messageLength.text);

  const [otherMembers, setOtherMembers] = useState([]) as any;
  const { data: session,status } = useSession();
  const currentUser = session?.user as SessionData;
  const [currentFriends, setCurrentFriends] = useState(currentUser.friends);
  const [change, setChange] = useState(false);
  const [text, setText] = useState("");
  const [send, setSend] = useState(currentUser?.isSend);
  const [isSend, setIsSend] = useState(send?.includes(otherMembers[0]?._id));

  const madeFriend = () =>{
    setCurrentFriends(prevFriends => [...prevFriends, otherMembers[0]?._id] as any);
  }

  const handleStateChange = () => {
    madeFriend();
  }
  useEffect(() => {
    if (status === "authenticated") {
      setCurrentFriends(currentUser.friends);
    }
  }, [status]);

  useEffect(() => {
    setLastMessage(chat?.messages?.length > 0 && messageLength.text);
  }, [chat]);

  const sendFriendRequest = async () => {
    try {
      const res = await fetch("/api/messages/agreed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: currentUser._id,
          friendId: otherMembers[0]?._id,
        }),
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  const sendFriendRequesty = async () => {
    try {
      const res = await fetch("/api/messages/agreed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: otherMembers[0]?._id,
          friendId: currentUser._id,
        }),
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  useEffect(() => {
    if (otherMembers.length === 1 && lastMessage == `Welcome, ${currentUser?.username}` && !(currentFriends?.includes( otherMembers[0]?._id)) ) {
      sendFriendRequest();
      madeFriend();
    }
    if (otherMembers.length === 1 && lastMessage == `Welcome, ${otherMembers[0]?.username}` && !(currentFriends?.includes( otherMembers[0]?._id)) ) {
      sendFriendRequesty();
      madeFriend();
      setChange(true);
    }
  }, [lastMessage, currentUser, chatId]);

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}/route`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data);
      setOtherMembers(
        data?.members?.filter((member: SessionData) => member._id !== currentUser?._id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const sendText = async () => {
    try {
      setText("");
      const res = await fetch("/api/messages/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });
      // if (res.ok) {
      //   setText("");
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const sendPhoto = async (result: any) => {
    try {
      const res = await fetch("/api/messages/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,//cloudinary的url
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  const memberId = otherMembers?.[0]?._id?? null;

  useEffect(() => {
    //订阅了一个名为 chatId(来自后端与后端一致) 的 Pusher 频道
    //每名用户都有属于自己的chatId
    pusherClient.subscribe(chatId);
    if (memberId) pusherClient.subscribe(memberId)
    pusherClient.subscribe(currentUser._id)
    //响应添加newMessage

    const handleMessage = async (newMessage: messageData) => {
      setChat((prevChat: any) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };
    const handleFriend = async (friendId: string) => {
      // 使用setCurrentFriends正确地更新状态
      setCurrentFriends(prevFriends => [...prevFriends, friendId] as any);
    };
    const handleSend = async (friendId: string) => {
      setSend(prevFriends => [...prevFriends, friendId] as any);
      setIsSend(send.includes(otherMembers[0]?._id));
    };
    pusherClient.bind("new-friend", handleFriend);
    pusherClient.bind("new-message", handleMessage);
    pusherClient.bind("new-send", handleSend);
    //清理阶段
    // 当组件卸载时，取消订阅Pusher频道
    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
      pusherClient.unsubscribe(otherMembers[0]?._id);
      pusherClient.unbind("new-friend", handleFriend);
      pusherClient.unsubscribe(currentUser._id);
      pusherClient.unbind("new-send", handleSend);
    };
  }, [chatId,messageLength,currentUser._id,otherMembers]);

  /* Scrolling down to the bottom when having the new message */

  const bottomRef = useRef(null) as any;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chat?.messages]);

  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false); // 新增状态，用于记录是否已经发送好友请求

  const makeFriend = async () => {
    if (!isFriendRequestSent) { // 如果尚未发送好友请求
      try {
        setIsSend(true);
        setIsFriendRequestSent(true); // 设置为已发送
        const res = await fetch("/api/messages/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            currentUserId: currentUser._id,
            text: "Friend application",
          }),
        });
        if (res.ok) {
          const res = await fetch("/api/messages/isSend", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              currentUserId: currentUser._id,
              friendId: otherMembers[0]._id,
            }),
          })
          // if (res.ok) {
          //   setIsSend(true);
          // }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      toast.info("Friend request already sent!");
    }
  };
  // console.log(currentFriends?.includes( otherMembers[0]?._id))

  return loading ? (
    <Loader />
  ) : (
    <div >
      <div className="h-[calc(100vh-4.2rem)]  flex flex-col bg-white relative">
        {/* 聊天标题 */}
        <div className="flex  gap-2 py-3 text-body-bold w-full">
          {chat?.isGroup ? (
            <>
              <Link href={`/chats/groupInfo/${chatId}`}>
                <img
                  src={chat?.groupPhoto || "/images/group.png"}
                  alt="group-photo"
                  className="w-11 h-11 rounded-full object-cover object-center ml-4"
                />
              </Link>

              <div className="text-small/[10px] mt-4">
                <p>
                  {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                  members
                </p>
              </div>
            </>
          ) : (
            <>
              <img
                src={otherMembers[0]?.image || "/images/person.jpg"}
                alt="profile photo"
                className="w-11 h-11 rounded-full object-cover object-center ml-4"
              />
              <div className=" whitespace-nowrap overflow-hidden text-ellipsis mt-2">
                <p className="text-tiny/[10px]">{otherMembers[0]?.username}</p>
                <p className="text-mm text-grey-3 whitespace-nowrap overflow-hidden text-ellipsis">{otherMembers[0]?.email}</p>
              </div>
              <div className="absolute right-4 top-3.5">
                {otherMembers.length === 1 ? (!isSend && !(currentFriends?.includes( otherMembers[0]?._id))&&!isFriendRequestSent ? (
                  <Button color="secondary" radius="sm" variant="bordered" size="md" onClick={() => {
                    makeFriend();
                    setIsSend(true);
                  }}>
                    Add friends
                  </Button>
                ) : (
                  <Button isDisabled color="secondary" radius="sm" variant="bordered" size="md" onClick={makeFriend}>
                    Add friends
                  </Button>
                )) : null}
              </div>
            </>
          )}
        </div>

        {/* 聊天内容 */}
        <div className="flex-1 flex flex-col gap-5 overflow-y-scroll ">
          {/* messages中的内容是从chat模型中提取的，不是按照seenby提取的 */}
          {chat?.messages?.map((message, index) => (
            <MessageBox
              key={index}
              message={message}
              currentUser={currentUser}
              chatId={chatId}
              otherMembers={otherMembers}
              handleStateChange={handleStateChange}
              change={change}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {chat.isGroup || currentFriends?.includes( otherMembers[0]?._id) ? (
          <div className="w-full flex items-center justify-between px-4 py-3 rounded-3xl cursor-pointer bg-white">
            <div className="flex items-center gap-4 w-full">
              <CldUploadButton
                options={{ maxFiles: 1 }}
                onSuccess={sendPhoto}
                uploadPreset="kdm7bzdm"
                className="mb-2"
              >
                <AddPhotoAlternate
                  sx={{
                    fontSize: "35px",
                    color: "#737373",
                    cursor: "pointer",
                    "&:hover": { color: "#7828c8" },
                  }}
                />
              </CldUploadButton>

              <textarea
                // type="text"
                placeholder="Write a message..."
                className="max-sm:w-full bg-transparent outline-none w-search h-8"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
            <div onClick={sendText}>
              <img src="/images/send.png" alt="send" className="w-10 h-10 rounded-full hover:scale-125 ease-in-out duration-300" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatDetails;
