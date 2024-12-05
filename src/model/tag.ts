import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema({
  tagText: {
    type: String,
    required: true
  },
  userId:{
    type: String,//Schema.Types.ObjectId,
    ref:"user",
    default:null
  },
  priority:{
    type: Number,
    default: 0,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
}
});

export default mongoose.model("Tag", tagSchema);