import mongoose from "mongoose";
const { Schema } = mongoose;

const friendSchema = new Schema({
  userId: {
    type: String,//Schema.Types.ObjectId,
    ref: 'User'
  },
  friendId: {
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

export default mongoose.model("Friend", friendSchema);
