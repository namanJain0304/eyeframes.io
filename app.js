if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const dbUrl=process.env.MONGOATLAS_URL;

main()
  .then((res) => {
    console.log("connection succesful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
const express = require("express");
var engine = require("ejs-mate");
var methodOverride = require("method-override");

const app = express();
app.use(methodOverride("_method"));
const frame = require("./routes/eyeframes.js");
const review = require("./routes/review.js");

const path = require("path");
const Eyeframe = require("./models/Eyeframe.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { schema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const port = 3008;
app.set("view engine", "ejs");
app.engine("ejs", engine);

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var session = require("express-session");
const MongoStore = require('connect-mongo');
var flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/user.js");

const store= MongoStore.create(
  {
    mongoUrl: dbUrl,
    crypto :{
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
  }
);
store.on("error",()=>{
  console.log("session store error",err);
})


app.use(
  session({
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/eyeframes", frame);
app.use("/eyeframes/:id/reviews", review);
app.use("/", userRoutes);

app.all("*", async (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);

  res.render("Error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
