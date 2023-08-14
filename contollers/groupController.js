const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const Group = require("../models/group");

exports.groups_list = asyncHandler(async (req, res, next) => {
  try {
    const groups = await Group.find();
    res.render("groups", {
      groups_list: groups,
    });
  } catch (error) {
    console.error();
  }
});

exports.groups_details = asyncHandler(async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate("countries");

    res.render("group_details", {
      group_detail: group.countries,
    });
  } catch (error) {
    console.error();
  }
});
