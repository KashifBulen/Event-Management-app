import mongoose from "mongoose";
const { Schema } = mongoose;

const genericNotification = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  notificationId:{
    type: String,
    required: true,
    ref: "Notification",
  },
  notificationStatus: {
    type: String,
    required: true
  },
  // notificationTime: {
  //   type: Date,
  //   required: true
  // },
  notificationTime: {
    type: [Date],
    default: null
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  Screen: {
    type: String,
    required: true
  },
  ScreenId: {
    type: String,
    required: true
  },
  isDeleted:{
    type: String,
    default: "n",
    enum: ["y", "n"],
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("Genericnotification", genericNotification);