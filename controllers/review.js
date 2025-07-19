const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postReview = async(req,res) => {
    const listing = await Listing.findById(req.params.id);
    const { rating, comment } = req.body;
    const review = new Review({ rating, comment });
    review.author = req.user._id;
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}