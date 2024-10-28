import { User } from "../../../../../../mongoDB/models/User";
import { connectDB } from "../../../../../../mongoDB/index";
import Chat from "../../../../../../mongoDB/models/Chat";
import Message from "../../../../../../mongoDB/models/Message";
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method!== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {userId, quary } = req.query;
  console.log(userId, quary);

  try {
    await connectDB();
    const searchedChat = await Chat.find({
      members: userId,
      name: { $regex: quary, $options: "i" },
    })
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
    return res.status(200).json(searchedChat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to search chat" });
  }
};
