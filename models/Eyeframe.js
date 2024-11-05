const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const eyeframeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default: "photos/spec1.jpg",
    },
  },
  location: {
    type: String,
    default: "toronto , canada",
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

eyeframeSchema.post("findOneAndDelete", async (frame) => {
  if (frame) {
    await Review.deleteMany({ _id: { $in: frame.review } });
  }
});

const Eyeframe = mongoose.model("Eyeframe", eyeframeSchema);
module.exports = Eyeframe;
