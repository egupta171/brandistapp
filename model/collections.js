/**
 * Created by eshaangupta on 10/13/15.
 */

/**
 * Created by eshaangupta on 10/11/15.
 */


var mongoose = require('mongoose');
var collectionSchema = new mongoose.Schema({
    collection_name: String,
    collection_brands: { type: Array, "default" : []}
    //updated_at: { type: Date, default: Date.now }
    //img: { data: Buffer, contentType: String }
});
mongoose.model('Collection', collectionSchema);