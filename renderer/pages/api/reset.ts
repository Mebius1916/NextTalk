import { User } from "../../mongoDB/models/User";
import { connectDB } from "../../mongoDB/index";
import { hash } from "bcryptjs";
import { NextApiRequest,NextApiResponse } from "next";
export default async function handler(req,res) {
  try {
    await connectDB();
    // 从请求中解析并验证 JSON 主体
    const body = await req.body;
    // console.log(body)
    const { email, password,VerificationCode,code } = body;
    if (VerificationCode!== code) {
      return res.status(400).json({ error:"Verification code is incorrect"});
    }
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "The user does not exist" });
    }
    const hashedPassword = await hash(password, 10);

    const newUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    // 返回不包括密码的安全用户信息
    return res.status(200).json({
      username: newUser.username,
      email: newUser.email,
    });
  } catch (err) {
    // console.error(err);
    return res.status(500).send("Failed to create a new user");
  }
}