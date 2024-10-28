import { connectDB } from "../../../mongoDB";
import Chat from "../../../mongoDB/models/Chat";
import Message from "../../../mongoDB/models/Message";
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {

  try {
    await connectDB();
    const body = await req.body;
    const { chatId } = body;
    const currentChat = await Chat.findById(chatId);
    const lastMessage = currentChat?.messages?.length > 0 && currentChat.messages[currentChat.messages.length - 1];
    const lastMessageId = lastMessage?._id;

    if (lastMessageId) {
      const newMessages = await Message.findByIdAndUpdate(
        lastMessageId,
        { $set: { isSeen: true } },
        { new: true }
      ).exec();
      res.status(200).json(newMessages);
    } else {
      // 如果没有最后一条消息的 ID，返回适当的响应
      res.status(404).json({ error: "No last message found in the chat" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update message" });
  }
}
