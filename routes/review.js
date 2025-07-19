const express = require("express");
const router = express.Router({mergeParams : true});
const validateReview = require("../middlewares/validateReview");
const { isLoggedIn, isReviewAuthor } = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/review");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;