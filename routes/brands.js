/**
 * Created by eshaangupta on 10/11/15.
 */

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    imageURLserver = 'http://192.168.1.4:3000/images/brand_images',
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
router.route('/getbrands')
    //GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('Brand').find({}, function (err, brands) {
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
                return res.json(brands);
            }
        });
    })
    //POST a new brand
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        console.log("Post function calledddddd.......");
        var name = req.body.name;
        var categories = req.body.categories;
        var created_at = req.body.created_at;
        //call the create function for our database
        mongoose.model('Brand').create({
            name : name,
            imageURL : (imageURLserver + '/' + name.toLowerCase() +'.jpg').replace(/\s/g, ''),
            categories : categories,
            created_at : created_at
        }, function (err, brand) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Brand has been created
                console.log('POST creating new brand: ' + brand);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("brands");
                        // And forward to success page
                        res.redirect("/api/v4/brands/getbrands");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(brand);
                    }
                });
            }
        })
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('brands/new', { title: 'Add New Brand' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Brand').findById(id, function (err, brand) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Brand').findById(req.id, function (err, brand) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + brand._id);
                res.format({
                    json: function(){
                        res.json(brand);
                    }
                });
            }
        });
    });

//GET the individual blob by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the blob within Mongo
    mongoose.model('Brand').findById(req.id, function (err, brand) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the blob
            console.log('GET Retrieving ID: ' + brand._id);
            //format the date properly for the value to show correctly in our edit form
            var brandcreated_at = brand.brandcreated_at.toISOString();
            brandcreated_at = brandcreated_at.substring(0, brandcreated_at.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                    res.render('brands/edit', {
                        title: 'Brands' + brand._id,
                        "brandcreated_at" : brandcreated_at,
                        "brand" : blob
                    });
                },
                //JSON response will return the JSON output
                json: function(){
                    res.json(brand);
                }
            });
        }
    });
});

//PUT to update a blob by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var created_at = req.body.created_at;

    //find the document by ID
    mongoose.model('Brand').findById(req.id, function (err, brand) {
        //update it
        brand.update({
            name : name,
            badge : badge,
            dob : dob,
            isloved : isloved
        }, function (err, blobID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        res.redirect("/blobs/" + blob._id);
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(blob);
                    }
                });
            }
        })
    });
});

//DELETE a Blob by ID
router.delete('/:id/edit', function (req, res){
    //find blob by ID
    mongoose.model('Brand').findById(req.id, function (err, brand) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            brand.remove(function (err, brand) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + brand._id + 'and by name: ' + brand.name);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function(){
                            res.redirect("/brands");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function(){
                            res.json({message : 'deleted',
                                item : brand
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
