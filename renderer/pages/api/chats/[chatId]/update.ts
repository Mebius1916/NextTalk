// 引入MongoDB模型和数据库连接函数
import Chat from "../../../../mongoDB/models/Chat";
import { connectDB } from "../../../../mongoDB/index";
import { NextApiRequest, NextApiResponse } from "next";
// 使用默认导出的异步函数定义API处理程序
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    // 连接数据库
    await connectDB();
    const { chatId } = req.query; 
    const body = await req.body;//很多时候是这里的错误
    const { name, groupPhoto } = body;
    // console.log({ chatId, name, groupPhoto });
    // 使用findByIdAndUpdate方法更新数据库记录
    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    // 如果更新成功，返回更新后的聊天信息
    res.status(200).json(updatedGroupChat);
  } catch (err) {
    // 捕获并处理异常，返回错误响应
    res.status(500).send("Failed to update group chat info");
  }
}
