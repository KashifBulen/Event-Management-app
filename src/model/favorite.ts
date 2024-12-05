import mongoose from "mongoose";
const { Schema } = mongoose;

const favoriteSchema = new Schema({
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
  updatedAt: {
    type: String,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("Favorite",  favoriteSchema);