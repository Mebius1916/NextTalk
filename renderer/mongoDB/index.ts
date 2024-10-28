import mongoose from "mongoose";
let isConnected : boolean = false;
export const connectDB = async () => {
  //  console.log("MongoDB is connecting");
    mongoose.set('strictQuery', true)//开启严格模式
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    try {

        await mongoose.connect(
          process.env.MONGODB_URL as string,
          {
            dbName: "NextChat",//连接数据库的名字
            //@ts-ignore
            useNewUrlParser: true,
        });
        isConnected = true;
        console.log("MongoDB is connected");
    } catch (error) {
        console.log(error);
    }
}