import { User } from "../../../mongoDB/models/User"
import { connectDB } from "../../../mongoDB/index"
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    await connectDB();
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch users");
  }
}