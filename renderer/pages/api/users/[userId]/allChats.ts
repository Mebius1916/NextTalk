import { User } from "../../../../mongoDB/models/User";
import { connectDB } from "../../../../mongoDB/index";
import Chat from "../../../../mongoDB/models/Chat";
import Message from "../../../../mongoDB/models/Message";
import { NextApiRequest,NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    await connectDB();

    const { userId } = req.query;

    const allChats = await Chat.find({ members: userId })
     .sort({ lastMessageAt: -1 })
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

    res.status(200).json(allChats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get all chats of current user" });
  }
};
