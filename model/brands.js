/**
 * Created by eshaangupta on 10/11/15.
 */


var mongoose = require('mongoose');
var brandSchema = new mongoose.Schema({
    name: String,
    created_at: { type: Date, default: Date.now },
    imageURL: String,
    categories: [String]
    //updated_at: { type: Date, default: Date.now }
    //img: { data: Buffer, contentType: String }
});
mongoose.model('Brand', brandSchema);