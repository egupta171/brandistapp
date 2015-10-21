/**
 * Created by eshaangupta on 10/11/15.
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
router.route('/getusers')
  //GET all offers
    .get(function(req, res, next) {
      mongoose.model('User').find({}, function (err, users) {
        if (err) {
          return console.error(err);
        } else {
          return res.json(users);
        }
      });
    })
  //POST a new brand
    .post(function(req, res) {
      // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
      console.log("Post function for users calledddddd.......with user name: " + req.body.user_id);
      var first_name = req.body.first_name;
      var last_name = req.body.last_name;
      var user_id = req.body.user_id;
      var email_id = req.body.email_id;
      var facebook_link = req.body.facebook_link;

      //call the create function for our database
      mongoose.model('User').create({
        user_id : user_id,
        first_name : first_name,
        last_name : last_name,
        email_id : email_id,
        facebook_link : facebook_link
      }, function (err, user) {
        if (err) {
          res.send("There was a problem adding the user to the database.");
        } else {
          //Offer has been created
          console.log('POST creating new user: ' + user);
          res.format({
            //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
            html: function(){
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location("users");
              // And forward to success page
              res.redirect("/api/v4/users/getusers");
            },
            //JSON response will show the newly created blob
            json: function(){
              res.json(user);
            }
          });
        }
      })
    });

router.route('/:userId')
    .get(function(req, res) {
      console.log('Querying id with' + req.params.userId)
      mongoose.model('User').findOne({user_id : req.params.userId}, function (err, user) {
        if (err) {
          console.log('GET Error: There was a problem retrieving: ' + user);
        } else {
          console.log('GET Retrieving User: ' + user);
          res.json(user)
        }
      });
    });


module.exports = router;
