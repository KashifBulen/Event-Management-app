import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema({
  _id: {
    type: String,
    default: null,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  userName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  phone: {
    type: String,
    required: false,
    default: null,
  },
  password: {
    type: String,
    required: false,
    minlength: 6,
  },
  otp: {
    code: {
      type: String,
      default: "",
    },
    expireTime: {
      type: Date,
      default: null,
    },
  },
  companyId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'company'
  },
  gender: {
    type: String,
    default: "Male",
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: String,
    default: null,
    require: true,
  },
  verified: {
    type: Boolean,
    index: true,
    default: false,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
    required: true,
  },
  about: {
    type: String,
    default: null,
  },
  photoUrl: {
    type: String,
    default: null,
  },
  signInType: {
    type: String,
    enum: ["email", "google", null],
    require: true,
    default: null
  },
  allowPeopleToConnect: {
    type: Boolean,
    default: false
  },
  pushAlerts: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    default: null
  },
  profession: {
    type: String,
    default: null
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tag'
    }],
    default: []
  },
  deviceToken: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true, //This field value can not be modifed once added
  },
  updatedAt: { type: String, default: Date.now },
  hasCompleteProfile: { type: Boolean, default: false }
});

export default mongoose.model("User", usersSchema);
