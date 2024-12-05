import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  eventId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Event",
  },
  text: {
    type: String,
    required: true,
    default: "",
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("Comment",  commentSchema);