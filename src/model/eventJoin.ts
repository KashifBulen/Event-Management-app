import mongoose from "mongoose";
const { Schema } = mongoose;

const eventJoinSchema = new Schema({
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
  extraInfo: {
    type: Object,
    default: {}
  },
  milestonesCompleted: [{

  }],
  isCompleted:{
    type: String,
    default: "n",
    enum: ["n", "y"],
  },
  milestonesSkipped: [{

  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("EventJoin", eventJoinSchema);