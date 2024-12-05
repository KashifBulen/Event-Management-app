import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  eventId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Event",
    default:null
  },
  notificationType: {
    type: String,
    required: true
  },
  notificationText: {
    type: String,
    required: true
  },
  
  isPending:{
    type: String,
    default: "n",
    enum: ["n", "y"],
  },
  readStatus: {
    type: String,
    default: "unread",
    enum: ["unread", "read"],
  },
  extraInfo:{
    type: Object,
    required:false,
    default:{}
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("Notification",  notificationSchema);