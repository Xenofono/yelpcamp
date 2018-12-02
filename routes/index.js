var express = require("express");
var router = express.Router();
var User = require("../models/user")
var passport = require("passport");

router.get("/", function(req, res) {
    res.render("landing");
});




//Register route show register
router.get("/register", function(req, res) {
    res.render("register");
});

//New account registration
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {

            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Välkommen till YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


//Show login
router.get("/login", function(req, res) {
    res.render("login");
});

//Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {

});


//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Du är utloggad");
    res.redirect("/campgrounds");
});





module.exports = router;
