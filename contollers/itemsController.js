const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const Group = require("../models/group");

exports.items_list = asyncHandler(async (req, res, next) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.render("items", {
      items_list: items,
    });
  } catch (error) {
    console.error();
  }
});

exports.item_details = asyncHandler(async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    const continent = await Group.findById(item.continent);

    res.render("item_details", {
      item: item,
      name: item.name,
      continent: continent,
      population: item.population,
      gdp: item.gdp,
    });
  } catch (error) {
    console.error();
  }
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  try {
    const groups = await Group.find();

    res.render("item_form", {
      title: "Create a Country",
      continent_list: groups,
    });
  } catch (err) {
    console.error();
  }
});

exports.item_create_post = [
  // Validate and sanitize fields.
  body("name").trim().notEmpty().withMessage("Name must be specified."),
  body("continent").notEmpty().withMessage("Continent is required"),
  body("population")
    .isFloat({ min: 0 })
    .withMessage("Population must be positive"),
  body("gdp").isFloat({ min: 0 }).withMessage("GDP must be positive"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are validation errors, re-render the form with error messages.
      const groups = await Group.find();
      res.render("item_form", {
        title: "Create a Country",
        continent_list: groups,
        errors: errors.array(),
        // You might also want to pass the req.body values back to the form for user convenience.
        name: req.body.name,
        continent: req.body.continent,
        population: req.body.population,
        gdp: req.body.gdp,
      });
      return;
    }

    // Data from form is valid.
    const newItem = new Item({
      name: req.body.name,
      continent: req.body.continent,
      population: req.body.population,
      gdp: req.body.gdp,
    });

    // Save the new item
    await newItem.save();

    async function updateContinent() {
      await Group.findByIdAndUpdate(
        { _id: newItem.continent },
        { $push: { countries: newItem } },
        { new: true }
      );
    }

    updateContinent();

    // Redirect to new item record.
    res.redirect(newItem.url);
  }),
];

// Display Item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.render("item_delete", {
    title: "Are you sure you want to delete this Country?",
    url_id: req.params.id,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.params.id);
  res.redirect("/home/items");
});
