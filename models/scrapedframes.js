const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scrapedSchema = new Schema({
  brandName: {
    type: String,
    required: true,
  },
  frameName: {
    type: String,
    required: true,
  },
  scrapedPrice: {
    type: String,
    required: true,
  },
});

// Create the model
const Scrapedframes = mongoose.model("Scrapedframes", scrapedSchema);

// Export the model
module.exports = Scrapedframes;
