import mongoose from "mongoose";

const themeSchema = new mongoose.Schema({
  themeName: {
    type: String,
    default: null
  },
  photoUrl: {
    type: String,
    default: null
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

export default mongoose.model("Theme", themeSchema);
