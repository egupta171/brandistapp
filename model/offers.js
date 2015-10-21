/**
 * Created by eshaangupta on 10/11/15.
 */


var mongoose = require('mongoose');
var offerSchema = new mongoose.Schema({
    brand_id: String,
    type: String,
    description: String,
    created_at: { type: Date, default: Date.now },
    valid_till: Date,
    imageURL: String
    //updated_at: { type: Date, default: Date.now }
    //img: { data: Buffer, contentType: String }
});
mongoose.model('Offer', offerSchema);