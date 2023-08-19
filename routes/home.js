var express = require("express");
var router = express.Router();
const homeController = require("../contollers/homeController");
const itemsController = require("../contollers/itemsController");
const groupController = require("../contollers/groupController");

// Home page route
router.get("/", homeController.index);

// Items Page
router.get("/items", itemsController.items_list);

// Create Item Page
router.get("/items/create", itemsController.item_create_get);

// Post Created Item
router.post("/items/create", itemsController.item_create_post);

// Delete Item Page
router.get("/items/:id/delete", itemsController.item_delete_get);

// Delete Item Page
router.post("/items/:id/delete", itemsController.item_delete_post);

// Specific Item Page
router.get("/items/:id", itemsController.item_details);

// Groups Page
router.get("/groups", groupController.groups_list);

// get Group form page
router.get("/groups/create", groupController.group_create_get);

// POST created Group
router.post("/groups/create", groupController.group_create_post);

// Delete Group Page
router.get("/groups/:id/delete", groupController.group_delete_get);

// Delete Group Page
router.post("/groups/:id/delete", groupController.group_delete_post);

// Specific Group Page
router.get("/groups/:id", groupController.groups_details);

module.exports = router;
