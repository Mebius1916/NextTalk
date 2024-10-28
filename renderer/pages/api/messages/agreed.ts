import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../mongoDB";

import { User } from "../../../mongoDB/models/User";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    await connectDB();
    const body = await req.body;
    const {currentUserId,friendId} = body;
    // console.log(currentUserId,friendId);
    const user = await User.findById(currentUserId);
    if(user){
      const user = await User.findByIdAndUpdate(
        currentUserId,
        {
          $addToSet:{friends:friendId}
        },
        { new: true }
      ).exec();
      return res.status(200).json(user);
    }
  }catch(err){
    console.log(err);
    return res.status(500).json({error:"Failed to update send"});
  }

}