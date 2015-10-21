/**
 * Created by eshaangupta on 10/13/15.
 */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
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
router.route('/getcollections')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('Collection').find({}, function (err, collections) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                /*
                 res.format({
                 //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                 html: function(){
                 res.render('brands/index', {
                 title: 'All my Brands',
                 "brands" : brands
                 });
                 },
                 //JSON response will show all blobs in JSON format
                 json: function(){
                 res.json(infophotos);
                 }
                 });  */
                return res.json(collections);
            }
        });
    })
    //POST a new brand
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        console.log("Post function calledddddd....... with req = " + req.body.toString());
        var collection_name = req.body.collection_name;
        var collection_brands = req.body.collection_brands;
        //call the create function for our database
        mongoose.model('Collection').create({
            collection_name : collection_name,
            collection_brands : collection_brands
        }, function (err, collection) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Brand has been created
                console.log('POST creating new collection: ' + collection);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("collections");
                        // And forward to success page
                        res.redirect("/api/v4/collections/getcollections");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(collection);
                    }
                });
            }
        })
    });

router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var collection_name = req.body.collection_name;
    var collection_brands = req.body.collection_brands;

    //find the document by ID
    mongoose.model('Collection').findById(req.params.id, function (err, collection) {
        //update it
        console.log("Found collection by name " + collection.collection_name);
        collection.update({
            collection_name : collection_name,
            collection_brands : collection_brands
        }, function (err, collectionID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        console.log("Collection updated successfully");
                        res.redirect("/api/v4/collections/getcollections");
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(collection);
                    }
                });
            }
        })
    });
});

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('collections/new', { title: 'Add New Collection' });
});

module.exports = router;
