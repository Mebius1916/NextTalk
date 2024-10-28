import { SessionData } from "../../../lib/type";
import { User } from "../../../mongoDB/models/User";
import { connectDB } from "../../../mongoDB/index";
import Chat from "../../../mongoDB/models/Chat";
import Message from "../../../mongoDB/models/Message";
import { pusherServer } from "../../../lib/pusher";
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    await connectDB();
    const body = await req.body;
    const { chatId, currentUserId, text, photo } = body;
    const currentUser = await User.findById(currentUserId);
    const newMessage = await Message.create({
      chat: chatId,
      //需要拿到头像、用户名等信息
      sender: currentUser,
      text,
      photo,
      // 订阅者为自己？
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
     .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
     .populate({
        path: "members",
        model: "User",
      })
     .exec();
     
      /*这行代码调用了Pusher服务器对象上的trigger方法。
      这个方法的功能是向Pusher服务器发送一个事件newMessage，

      该事件将被发送到名为 chatId 的频道。*/
    await pusherServer.trigger(chatId, "new-message", newMessage)

  /* 触发一个 Pusher 事件，通知聊天的每个成员有关聊天更新的最新消息 */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member:SessionData) => {
      try {
        // 向所有的成员推送消息
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage]
        });
      } catch (err) {
        console.error(`Failed to trigger update-chat event`);
      }
    });

    return res.status(200).json(newMessage);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to create new message" });
  }
};
