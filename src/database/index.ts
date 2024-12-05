import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Db connected successfully');
    } catch (err) {
        console.log("Db connection error : ", err);
        process.exit(1);
    }

};

const disconnectDB = async () => {
    try{
        await mongoose.disconnect();
        console.log('Db dis-connected successfully');
    }catch{
        console.log('Error dis-connecting');
    }
}

export default {
    connectDB,
    disconnectDB
}