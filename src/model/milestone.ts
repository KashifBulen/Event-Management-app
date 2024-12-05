import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  milestoneName: {
    type: String,
    required: true
  },
  milestoneIdentifier: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    required: true
  },
  photoUrl: {
    type: String,
    default: null
  },
  completionTiming: {
    type: Number,
    default: 0
  },
  hasModal: {
    type: Boolean,
    default: false
  },
  isMandatory: {
    type: Boolean,
    default: false
  },
  sequence: {
    type: Number,
    default: 0
  },
  eventTypeIds: {
    type: Array,
    required: true,
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

export default mongoose.model("Milestone", milestoneSchema);
