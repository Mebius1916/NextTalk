import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
  //群成员_id的集合
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    default: []
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    default: []
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  groupPhoto: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
})
const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema)
export default Chat