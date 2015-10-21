/**
 * Created by eshaangupta on 10/14/15.
 */

/**
 * Created by eshaangupta on 10/11/15.
 */

var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email_id: String,
    phone_number: String,
    gender: String,
    user_id: String,
    facebook_link: String
    //updated_at: { type: Date, default: Date.now }
    //img: { data: Buffer, contentType: String }
});
mongoose.model('User', userSchema);