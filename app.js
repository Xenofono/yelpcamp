var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");


var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


//seedDB();
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://kristoffer:sa94krna@ds127094.mlab.com:27094/yelpcamping");
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
    secret: "banan tåget kaninen gurkan tjock jacka triumfera",
    resave: false,
    saveUnitialized: false
}));


app.locals.moment = require("moment");

//Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//Required routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Campingserver startad");
});
