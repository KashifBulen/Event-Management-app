import mongoose from "mongoose";
const { Schema } = mongoose;

const inviteEventJoinSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Event",
  },
  senderId: {
    type: String,//Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverId: {
    type: String,//Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: String,
    enum: ["accept", "reject", "pending"],
    default: "pending",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true, //This field value can not be modifed once added
  }
});

export default mongoose.model("EventJoinInvite", inviteEventJoinSchema);
