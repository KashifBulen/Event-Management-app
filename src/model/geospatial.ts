import mongoose from "mongoose";
const { Schema } = mongoose;

const geoSpatialSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        default: null,
      },  
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default:"Point"
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  });
  geoSpatialSchema.index({ location: "2dsphere" }); 
export default mongoose.model("Geospatial", geoSpatialSchema);