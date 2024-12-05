import mongoose from "mongoose";

const eventTypeSchema = new mongoose.Schema({
  eventTypeName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
}
});

export default mongoose.model("EventType", eventTypeSchema);