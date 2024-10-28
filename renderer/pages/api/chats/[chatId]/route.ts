import { User } from "../../../../mongoDB/models/User";
import { connectDB } from "../../../../mongoDB/index";
import Message from "../../../../mongoDB/models/Message";
import Chat from "../../../../mongoDB/models/Chat";
import { NextApiRequest, NextApiResponse } from "next";
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    try {
      await connectDB();
      const { chatId } = req.query;
      const chat = await Chat.findById(chatId)
       .populate({
          path: "members",
          model: User,
        })
       .populate({
          path: "messages",
          model: Message,
          populate: {
            path: "sender seenBy",
            model: User,
          },
        })
       .exec();
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get chat details" });
    }
  };
  
  export default handler;

  const postHandler = async (req:any, res:NextApiResponse) => {
    try {
      await connectDB();
      const { chatId } = req.query;
      const body = await req.json();
      const { currentUserId } = body;
      await Message.updateMany(
        { chat: chatId },
        { $addToSet: { seenBy: currentUserId } },
        { new: true }
      )
       .populate({
          path: "sender seenBy",
          model: User,
        })
       .exec();
      res.status(200).json({ message: "Seen all messages by current user" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to update seen messages" });
    }
  };
  
  export { postHandler as POST };
