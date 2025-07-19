const express = require("express");
const router = express.Router();
const validateListing = require("../middlewares/validateListing");
const {isLoggedIn, isOwner} = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listing");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('image'), validateListing, wrapAsync(listingController.postListing))

router.get("/new", isLoggedIn, listingController.newForm)

router.route("/:id")
.get(wrapAsync(listingController.getListing))
.put(isOwner, upload.single('image'), validateListing, wrapAsync(listingController.editListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm))

module.exports = router;