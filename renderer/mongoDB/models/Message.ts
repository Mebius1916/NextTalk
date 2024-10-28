//每条消息都为一个Message模型个体
import mongoose from "mongoose"
const MessageSchema = new mongoose.Schema({
  //群组 || 个人 聊天个体
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  //发送者User个体
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },  
  text: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //订阅者User数组(自己 and others)
  seenBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    default: []
  },
  //用于查看最后一条消息是否已读
  isSeen:{
    type: Boolean,
    default: false
  }
})

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)

export default Message