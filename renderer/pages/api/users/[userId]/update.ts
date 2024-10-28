import { User } from "../../../../mongoDB/models/User";
import { connectDB } from "../../../../mongoDB/index";
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    await connectDB();

    const { userId } = req.query;
    const body = await req.body;

    const { username, image } = body;
    // 使用 User 模型的 findByIdAndUpdate 方法来查找并更新用户记录
    const updatedUser = await User.findByIdAndUpdate(
      // 用户的唯一标识符，用于定位要更新的用户文档
      userId,
      {
        // 要更新的用户属性，这里是用户名和头像
        username,
        image,
      },
      // 将 new 设置为 true，表示返回更新后的用户文档，而不是更新前的文档
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to update user" });
  }
};
