import { User } from "../../../../../../mongoDB/models/User";
import { connectDB } from "../../../../../../mongoDB/index";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { quary } = req.query;

  try {
    await connectDB();

    // 在 username 与 email 中用正则搜索进行 or 匹配
    const searchedContacts = await User.find({
      $or: [
        { username: { $regex: quary, $options: "i" } },
        { email: { $regex: quary, $options: "i" } },
      ],
    });

    // 使用 res.status() 设置状态码并发送 JSON 数据
    res.status(200).json(searchedContacts);
  } catch (err) {
    console.error(err);
    // 使用 res.status() 设置状态码并发送错误消息
    res.status(500).json({ error: "Failed to search contact" });
  }
}
