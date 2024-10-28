import mongoose from "mongoose";
export interface SessionData {
  id:string,
  _id: string,
  username: string,
  email: string,
  password: string,
  image?: string,
  chats?: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  role: string,
  VerificationCode?:string,
  friends?:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isSend?:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}

export interface messageData{
  chat: string,
  sender: SessionData,
  text:string
  photo:string
  // 订阅者为自己？
  seenBy: SessionData[],
}

export interface chatData{
  members:[],
  messages:[],
  isGroup:boolean,
  name?:string,
  groupPhoto?:string,
  createdAt:Date,
  lastMessageAt:Date,
  _id:string,
}