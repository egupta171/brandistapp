/**
 * Created by eshaangupta on 10/15/15.
 */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    imageURLserver = 'http://192.168.1.4:3000/images/sponsored_images',
    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.route('/getsponsored')
    //GET all offers
    .get(function(req, res, next) {
        console.log("Sponsored Call Received");
        mongoose.model('Sponsored').find({}, function (err, feeds) {
            console.log("Sponsored results found");
            if (err) {
                return console.error(err);
            } else {
                return res.json(feeds);
            }
        });
    })
    //POST a new brand
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        console.log("Post function for sponsored calledddddd.......with sponsored name: " + req.body.name);
        var name = req.body.name;
        var brand_id = req.body.brand_id;
        var imageURL = (imageURLserver + '/' + name.toLowerCase() +'.jpg').replace(/\s/g, '');

        //call the create function for our database
        mongoose.model('Sponsored').create({
            name : name,
            brand_id : brand_id,
            imageURL : imageURL
        }, function (err, feed) {
            if (err) {
                res.send("There was a problem adding the sponsored to the database.");
            } else {
                //Offer has been created
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("sponsored");
                        // And forward to success page
                        res.redirect("/api/v4/sponsored/getsponsored");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(feed);
                    }
                });
            }
        })
    });

module.exports = router;
