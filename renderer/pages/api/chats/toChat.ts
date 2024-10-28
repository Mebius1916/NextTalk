import { User } from "../../../mongoDB/models/User";
import { connectDB } from "../../../mongoDB/index";
import { pusherServer } from "../../../lib/pusher";
import Chat from "../../../mongoDB/models/Chat";
import { ObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    await connectDB();
    //必须为ts/js对象才能解析
    const body = JSON.parse(await req.body as any);
    const { currentUserId, members, isGroup, name, groupPhoto } = body;
    console.log({ currentUserId, members, isGroup, name, groupPhoto });
    // 根据是否为群组聊天构建查询条件
    const query = isGroup
     ? { isGroup, name, groupPhoto, members: [currentUserId,...members] }
      : { members: { $all: [currentUserId,...members], $size: 2 } };
    let chat = await Chat.findOne(query);

    // 如果新建群组是合理的
    if (!chat) {
      chat = await new Chat(
        isGroup? query : { members: [currentUserId,...members] }
      );
      await chat.save();
      // 将群组_id添加到user模型中的chats[]数组中
      const updateAllMembers = chat.members.map(async (memberId: { _id: ObjectId }) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      // 并发地执行所有更新操作
      Promise.all(updateAllMembers);
      // 为每个成员触发一个实时事件推送，通知他们有新的聊天记录
      chat.members.map(async (member:{_id:ObjectId}) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }
    // 使用 res.status() 设置状态码并发送 JSON 数据
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    // 使用 res.status() 设置状态码并发送错误消息
    res.status(500).json({ error: "Failed to create a new chat" });
  }
}
