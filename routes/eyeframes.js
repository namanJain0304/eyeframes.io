const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { schema } = require("../schema.js");
const Eyeframe = require("../models/Eyeframe.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Scrapedframes = require("../models/scrapedframes.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const validateSchema = (req, res, next) => {
  let result = schema.validate(req.body);

  if (result.error) {
    let errormsg = result.error.details.map((er) => er.message).join(",");
    throw new ExpressError(400, errormsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const { brand, material, color, sortPrice } = req.query;

    let filters = {};
    if (brand) {
      filters.brand = { $in: Array.isArray(brand) ? brand : [brand] }; // In case of multiple selections
    }
    if (material) {
      filters.material = {
        $in: Array.isArray(material) ? material : [material],
      };
    }
    if (color) {
      filters.color = { $in: Array.isArray(color) ? color : [color] };
    }

    let query = Eyeframe.find(filters);

    // Sorting logic
    if (sortPrice === "lowToHigh") {
      query = query.sort({ price: 1 });
    } else if (sortPrice === "highToLow") {
      query = query.sort({ price: -1 });
    }

    const frames = await query.exec();
    res.render("frames/index.ejs", { frames, brand: req.query.brand,
      material: req.query.material,
      color: req.query.color,
      sortPrice: req.query.sortPrice});
  })
);

router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("frames/new.ejs");
  })
);
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let frame = await Eyeframe.findById(req.params.id)
      .populate({
        path: "review",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!frame) {
      req.flash("error", "Sorry, We cant find your Eyeframe");
      res.redirect("/eyeframes");
    }
    // Fetch all scraped frames
  const scrapedFrames = await Scrapedframes.find();
  //console.log(scrapedFrames);
  
  // Match logic: find a scraped frame where brandName matches description 
  // and frameName matches title
  let savings = null;
  for (const webframe of scrapedFrames) {
    console.log(webframe.brandName);
    const priceString = webframe.scrapedPrice;
    const priceNumber = parseFloat(priceString.replace('$', ''));
    if (frame.brand === webframe.brandName && frame.name === webframe.frameName) {
      console.log("trueeee");
      savings = priceNumber - frame.price;
      break;
    }
  }
    //console.log(frame);
    res.render("frames/show.ejs", { frame, savings });
  }) 
);
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let frame = await Eyeframe.findById(req.params.id);
    let originalImageUrl = frame.image.url;
    res.render("frames/edit.ejs", { frame, originalImageUrl });
  })
);

router.post(
  "/",
  isLoggedIn,
  upload.single("frame[image][url]"),
  validateSchema,
  wrapAsync(async (req, res) => {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.frame.location,
        limit: 1,
      })
      .send();
    console.log(req.body); // This will show you the data structure being received
    let { frame } = req.body;
    if (!frame.image) {
      frame.image = {};
    }

    // Check if an image file was uploaded
    if (req.file) {
      frame.image.url = req.file.path;
      frame.image.filename = req.file.filename;
    } else {
      // Set default image if no image was uploaded
      frame.image.url =
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
      frame.image.filename = "default_image.jpg";
    }

    let newframe = new Eyeframe(frame);
    newframe.owner = req.user._id;
    newframe.geometry = response.body.features[0].geometry;

    let savedFrame = await newframe.save();
    req.flash("success", "Your eyeframe has been created");
    res.redirect("/eyeframes");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("frame[image][url]"),
  validateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let frame = await Eyeframe.findByIdAndUpdate(id, { ...req.body.frame });
    if (typeof req.file !== "undefined") {
      frame.image.url = req.file.path;
      frame.image.filename = req.file.filename;
      await frame.save();
    }
    req.flash("success", "Your eyeframe has been updated");
    if (!frame) {
      req.flash("error", "Sorry, We cant find your Eyeframe");
      res.redirect("/eyeframes");
    }

    res.redirect(`/eyeframes/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let frame = await Eyeframe.findByIdAndDelete(id);
    req.flash("success", "Your eyeframe has been deleted");

    res.redirect("/eyeframes");
  })
);

module.exports = router;
