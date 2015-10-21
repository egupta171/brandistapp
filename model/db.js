/**
 * Created by eshaangupta on 10/11/15.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/brandistappdb', function(err){
    if(err) {
        console.log('connection error', err)
    } else {
        console.log('connection successful')
    }
});

