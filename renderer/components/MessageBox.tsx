import { format, isSameDay, differenceInDays } from 'date-fns';
import { SessionData } from "../lib/type"
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useState } from "react";
type MessageBox = {
  message: any,
  currentUser: SessionData,
  handleStateChange: () => void,
  chatId?:string,
  otherMembers?:any
}

const MessageBox = ({ message, currentUser,handleStateChange,chatId,otherMembers }: MessageBox) => {
  const isFriend = currentUser?.friends?.includes( message?.sender?._id);
  const [isAgree, setIsAgree] = useState(isFriend);
 
function displayTime(createdAt:string) {
  const createdAtDate = new Date(createdAt);
  const now = new Date();

  if (isSameDay(createdAtDate, now)) {
    // 获取小时数
    const hour = createdAtDate.getHours();
    // 根据小时数判断是AM还是PM
    const ampm = hour < 12 ? 'AM' : 'PM';
    // 格式化时间，小时数使用24小时制
    const time = format(createdAtDate, "HH:mm");
    // 返回时间字符串，包括AM/PM标识
    return `${time} ${ampm}`;
  } else {
    // 如果不在同一天内，显示几天前
    const daysAgo = differenceInDays(now, createdAtDate);
    return `${daysAgo} days ago`;
  }
}
  const agree = async () =>{
    try{
      const res = await fetch("/api/messages/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text:`Welcome, ${otherMembers[0].username}`,
        }),
      });
      if(res.ok){
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
        if(res.ok){
          const res = await fetch("/api/messages/agreed", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              currentUserId: currentUser._id,
              friendId: otherMembers[0]._id,
            }),
          })
          if(res.ok){
              setIsAgree(true);
              handleStateChange();
            }
        }
      }
    }catch(err){
      console.log(err);
    }
  }
  // 如果是当前用户发送的消息，那么就从右向左显示，否则从左向右显示
  return message?.sender?._id !== currentUser._id ? (
    <div className="flex gap-2 items-start ml-4 ">
      <div className="flex gap-2 items-end">
        <div>
          <p className="text-mm ml-2">
           {message?.sender?.username}  
          </p>
          <img src={message?.sender?.image || "/images/person.jpg"} alt="profile photo" className="w-[2.1rem] h-[2.1rem] rounded-full" />
        </div>
          {message?.text ? (
            <>
            <div className="flex-col">
              <p className="text-mm">
                {displayTime(message?.createdAt)}    
             </p>
              <p className="w-fit bg-secondary text-white p-2 rounded-md text-smm max-w-[400px] whitespace-normal break-words">{message?.text}</p>
            </div>
            { !isAgree && !isFriend && message?.text=="Friend application"?(
            <div className="mb-[0.3rem] cursor-pointer " onClick={agree}>
              <CheckCircleOutlineOutlinedIcon color="secondary"></CheckCircleOutlineOutlinedIcon>
            </div>
            ):null}
            </>
          ) : (
            <img src={message?.photo} alt="message" className="w-40 h-auto rounded-lg" />
          )}
        
      </div>
      
    </div>
  ) : (
    <div className="flex gap-2 items-start justify-end mr-4">
      <div className="flex gap-2 items-end">
        
        {message?.text ? (
        <div className="flex-col">
          <p className="text-mm">

          {displayTime(message?.createdAt)}  
            
          </p>
          <p className="w-fit bg-secondary text-white p-2 rounded-md text-smm max-w-[400px] whitespace-normal break-words">{message?.text}</p>
        </div>
        ) : (
          <img src={message?.photo} alt="message" className="w-40 h-auto rounded-lg" />
        )}
        <div>
          <p className="text-mm">
          {message?.sender?.username}
          </p>
          <img src={currentUser?.image || "/images/person.jpg"} alt="profile photo" className="w-[2.1rem] h-[2.1rem] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default MessageBox