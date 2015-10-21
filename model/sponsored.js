/**
 * Created by eshaangupta on 10/15/15.
 */


var mongoose = require('mongoose');
var sponsoredSchema = new mongoose.Schema({
    name: String,
    brand_id: String,
    imageURL: String
    //updated_at: { type: Date, default: Date.now }
    //img: { data: Buffer, contentType: String }
});
mongoose.model('Sponsored', sponsoredSchema);