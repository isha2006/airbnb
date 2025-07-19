const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in.");
    return res.redirect("/login");
  }
  next();
}

const saveReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

const isOwner = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to modify this listing.");
        return res.redirect(`/listings/${id}`)
    }
    next();
});

const isReviewAuthor = wrapAsync(async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);

    if (!review || !review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
});

module.exports = {
  isLoggedIn,
  saveReturnTo,
  isOwner,
  isReviewAuthor
};