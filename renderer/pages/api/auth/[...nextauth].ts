
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "../../../mongoDB/index";
import { User } from "../../../mongoDB/models/User";
import { compare } from "bcryptjs";
import { SessionData } from "../../../lib/type";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// 创建 NextAuth 配置对象
export default NextAuth({
  // 配置使用的认证提供者列表
  providers: [
    // 配置 Github 认证提供者，使用环境变量中的客户端 ID 和客户端密钥
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) {
          throw new Error("Invalid email or password");
        }
        await connectDB()
        const user = await User.findOne({ email });
        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  // 配置登录页面的 URL
  pages: {
    signIn: "/auth/login",
  },

  // 定义在验证过程中将会话和令牌进行处理的回调函数
  callbacks: {
    //更新session
    async session({ session }) {
      const mongodbUser = await User.findOne({ email: session.user?.email });
      const sessionUser = session.user as SessionData;
      sessionUser.id = mongodbUser._id.toString();
      session.user = { ...session.user, ...mongodbUser._doc };
      return session;
    },
    async jwt({ token, user }) {
      const User = user as SessionData;
      if (User) {
        token.role = User.role;
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          // 从登录用户信息中提取必要属性
          const { email, name, image, id } = user;
          // 连接数据库
          await connectDB();
          // 查询数据库中是否已经存在具有给定邮箱的用户
          const alreadyUser = await User.findOne({ email });

          // 如果不存在，则创建新用户
          if (!alreadyUser) {
            await User.create({ email, name, image, authProviderId: id });
          } else {
            // 如果用户已经存在，直接返回 true 表示登录成功
            return true;
          }
        } catch (error) {
          // 如果在处理过程中发生任何错误，抛出错误信息
          throw new Error("Error while creating user");
        }
      }

      // 如果是通过用户名和密码登录，则直接返回 true 表示登录成功
      if (account?.provider === "credentials") {
        return true;
      } else {
        // 其他情况返回 false，表示登录失败
        return false;
      }
    },
  },
});

