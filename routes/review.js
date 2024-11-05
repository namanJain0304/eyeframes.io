const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const { schema, reviewSchema } = require("../schema.js");
const Eyeframe = require("../models/Eyeframe.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const validateReviewSchema = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let errormsg = result.error.details.map((er) => er.message).join(",");
    throw new ExpressError(400, errormsg);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReviewSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    const frame = await Eyeframe.findById(id);
    frame.review.push(newreview);
    await frame.save();
    await newreview.save();
    req.flash("success", "Your review has been created");
    res.redirect(`/eyeframes/${id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Eyeframe.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your review has been deleted");
    res.redirect(`/eyeframes/${id}`);
  })
);

module.exports = router;
