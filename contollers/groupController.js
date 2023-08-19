const asyncHandler = require("express-async-handler");
const Group = require("../models/group");
const { body, validationResult } = require("express-validator");

exports.groups_list = asyncHandler(async (req, res, next) => {
  try {
    const groups = await Group.find();
    res.render("groups", {
      title: "All Continents",
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
      group: group,
      group_detail: group.countries,
    });
  } catch (error) {
    console.error();
  }
});

exports.group_create_get = asyncHandler(async (req, res, next) => {
  try {
    res.render("group_form", {
      title: "Create a Continent",
    });
  } catch (err) {
    console.error();
  }
});

exports.group_create_post = [
  // Validate and sanitize fields.
  body("name").trim().notEmpty().withMessage("Name must be specified."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are validation errors, re-render the form with error messages.
      const groups = await Group.find();
      res.render("group_form", {
        title: "Create a Continent",
        errors: errors.array(),
        // You might also want to pass the req.body values back to the form for user convenience.
        name: req.body.name,
      });
      return;
    }

    // Data from form is valid.
    const newItem = new Group({
      name: req.body.name,
      countries: [],
    });

    // Save the new item
    await newItem.save();

    // Redirect to new item record.
    res.redirect(newItem.url);
  }),
];

// Display Item delete form on GET.
exports.group_delete_get = asyncHandler(async (req, res, next) => {
  const group_list = await Group.findById(req.params.id).populate("countries");

  if (group_list.countries.length > 0) {
    res.render("group_delete", {
      title: "All Countries Must be Deleted before Deleting Continent?",
      url_id: req.params.id,
      countries_list: group_list.countries,
    });
  } else {
    res.render("group_delete", {
      title: "Are you sure you want to delete this Continent?",
      url_id: req.params.id,
      countries_list: group_list.countries,
    });
  }
});

exports.group_delete_post = asyncHandler(async (req, res, next) => {
  await Group.findByIdAndRemove(req.params.id);
  res.redirect("/home/groups");
});
