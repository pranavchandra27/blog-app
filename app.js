const express = require("express"),
  expressLayouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");
(methodOverride = require("method-override")),
  (flash = require("connect-flash")),
  (session = require("express-session")),
  (app = express());

const User = require("./model/users");

//Passport config
require("./config/passport")(passport);
//CONFIG DB
const db = require("./config/key").MongoURI;

//Connect to Database
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

//EJS
// app.use(expressLayouts);
app.set("view engine", "ejs");

//body-parser
app.use(
  express.urlencoded({
    extended: false
  })
);

//Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

//Global Variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.locals.moment = require("moment");

//ROUTES
app.use("/", require("./routes/blogs"));
app.use("/users", require("./routes/users"));
app.use("/", require("./routes/comments"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started On Port ${PORT}`);
});
