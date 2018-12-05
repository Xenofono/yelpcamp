var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

router.get("/", function(req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds) {
        Campground.count().exec(function(err, count) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var imgurl = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = { name: name, image: imgurl, description: desc, price: price, author: author };
    Campground.create(newcampground, function(err, newCamp) {
        if (err)
            console.log("FEL FEL FEL");
        else

            res.redirect("/campgrounds");
    });

});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err || !foundCamp) {
            req.flash("error", "Camping hittades inte");
            res.redirect("back");
        }

        else {

            res.render("campgrounds/show", { campground: foundCamp })
        }

    });
});

//EDIT ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {



    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err)
            res.render("back")
        else
            res.render("campgrounds/edit", { campground: foundCamp });

    });



});

//UPDATE ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, removedCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            console.log(removedCamp);
            res.redirect("/campgrounds")
        }
    })
});






module.exports = router;
