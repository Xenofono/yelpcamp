var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Campground.findById(req.params.id, function(err, foundCamp) {
            if (err || !foundCamp) {
                req.flash("error", "Campingplats hittades ej");
                res.redirect("back");
            }
            else {
                if (foundCamp.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "Du har inte tillstånd att göra detta");
                    res.redirect("back");
                }

            }
        })

    }
    else {
        req.flash("error", "Du måste logga in för att göra det");

        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Kommentar kan inte redigeras");
                res.redirect("back");
            }

            else {
                if (foundComment.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "Du måste logga in för att göra det");
                    res.redirect("back");
                }

            }
        })

    }
    else {
        req.flash("error", "Du måste logga in för att göra det");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Du måste logga in för att göra det");
    res.redirect("/login");
}


module.exports = middlewareObj;
