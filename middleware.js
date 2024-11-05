const Eyeframe = require("./models/Eyeframe.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please Log In");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let frame = await Eyeframe.findById(id);
  if (!frame.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You dont have permission to edit");
    return res.redirect(`/eyeframes/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author");
    return res.redirect(`/eyeframes/${id}`);
  }
  next();
};
