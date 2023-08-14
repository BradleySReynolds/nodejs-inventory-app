const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  countries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

//  Virtual for items's URL
groupSchema.virtual("url").get(function () {
  //  We don't use an arrow funciton as we'll need the this object

  return `/home/groups/${this._id}`;
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
