var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//New comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err)
            console.log(err)
        else {
            res.render("comments/new", { campground: foundCamp });
        }
    });

});

//Create comments
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err)
            console.log(err)
        else {
            var newComment = req.body.comment;

            Comment.create(newComment, function(err, createdComment) {
                if (err)
                    console.log(err)
                else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCamp.comments.push(createdComment);
                    foundCamp.save();
                    req.flash("success", "Kommentaren är tillagd!")
                    res.redirect("/campgrounds/" + foundCamp._id)
                }
            })

        }
    });

});


//COMMENTS EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err || !foundCamp) {
            req.flash("error", "Ingen camping med det ID");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err)
                res.redirect("back");
            else {
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
            }
        });
    })


});

//COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err)
            res.redirect("back");
        else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});


//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment) {
        if (err)
            res.redirect("back")
        else {
            req.flash("success", "Kommentar raderad")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router;
