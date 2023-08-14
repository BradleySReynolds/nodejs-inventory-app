const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  continent: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  population: {
    type: Number,
    required: true,
  },
  gdp: {
    type: Number,
    required: true,
  },
});

//  Virtual for items's URL
itemSchema.virtual("url").get(function () {
  //  We don't use an arrow funciton as we'll need the this object

  return `/home/items/${this._id}`;
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
