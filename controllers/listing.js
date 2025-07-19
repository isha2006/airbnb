const Listing = require("../models/listing");
const geocode = require("../utils/geocode");

module.exports.index = async (req, res) => {
    let listings = await Listing.find();
    res.render("listings/index.ejs", { listings });
}

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.postListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const { title, description, price, location, country } = req.body;
    const geometry = await geocode(location);
    const listing = new Listing({ title, description, price, location, country, geometry});
    listing.owner = req.user._id;
    listing.image = { url, filename };
    await listing.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
}

module.exports.getListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250,c_fill");
    res.render("listings/edit.ejs", { listing, originalUrl});
}

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
    let listing = await Listing.findByIdAndUpdate(id, { title, description, price, location, country }, { new: true });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}