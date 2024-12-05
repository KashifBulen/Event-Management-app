import mongoose from "mongoose";

const easyEventSchema = new mongoose.Schema({
  keyword: {
    type: String,
  },
  title:{
    type: String
  },
  hasMeta:{
    type: Boolean,
    default: false
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

export default mongoose.model("EasyEvent", easyEventSchema);