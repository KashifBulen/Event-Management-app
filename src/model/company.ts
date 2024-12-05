import mongoose from "mongoose";
const { Schema } = mongoose;

const companySchema = new Schema({
    userId: {
        type: String,
        default: null,
        ref: 'User'
    },
    creatorType: {
        type: String,
        default: "Creator",
        enum: ["Creator", "Business"],
        required: true
    },
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        lowercase: true,
        index: true,
    },
    registeredNumber: {
        type: String,
        // required: true,
    },
    position: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        required: false,
        default: null,
    },
    bestDescribeYou: {
        type: String,
        default: null,
    },
    shortDescription: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    street: {
        type: String,
        default: null,
    },
    houseNumber: {
        type: String,
        default: null,
    },
    addition: {
        type: String,
        default: null,
    },
    postalCode: {
        type: String,
        default: null,
    },
    photoUrl: {
        type: String,
        default: null
    },
    followers: {
        type: Number,
        default: 0,
        required: true,
    },
    events: {
        type: Number,
        default: 0,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
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

export default mongoose.model("Company", companySchema);
