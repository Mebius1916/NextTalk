import { User } from "../../mongoDB/models/User";
import { connectDB } from "../../mongoDB/index";
import { hash } from "bcryptjs";
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  try {
    await connectDB();
    // 从请求中解析并验证 JSON 主体
    const body = await req.body;

    const { username,email,password,VerificationCode,code } = body;
    console.log(body)
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({error:"User already exists"});
    }
    if (code!== VerificationCode) {
      return res.status(400).json({error:"Verification code is incorrect"});
    }
    // 哈希密码并创建新用户
    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 返回不包括密码的安全用户信息
    return res.status(200).json({
      username: newUser.username,
      email: newUser.email,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to create a new user");
  }
}