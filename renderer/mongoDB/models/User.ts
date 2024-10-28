import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    default:"",
  },
  chats:{
    type:[{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}],
    default:[],
  },
  role: { 
    type: String, 
    default: "user" 
  },
  friends:{
    type:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    default:[],
  },
  isSend:{
    type:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    default:[],
  },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);