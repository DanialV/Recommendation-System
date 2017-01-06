var fs = require('fs');
var mongoose = require('mongoose');
var async = require('async');
// mongo connect to
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' + "movie_db");
var database = mongoose.connection;
database.on('error', function(err) {
    console.log('Error : Mongo connection error'.red);
});
database.once('open', function() {
    console.log("connected to mongodb");
});
var db = require('mongo_schemas');
let temp = [
    "318",
    "858",
    "527",
    "1198",
    "260",
    "50",
    "2762",
    "750",
    "912",
    "593",
    "2858",
    "2028",
    "1193",
    "904",
    "2571",
    "1148",
    "1196",
    "1221",
    "1197",
    "908"
]
let result = [];
async.each(temp, function(index, cb) {
    db.movie_info.findOne({
        'movie_id': index
    }).lean().exec(function(err, info) {
        if (err) {
            console.log("Mongo Error");
            cb(err);
        }
        result.push(info);
        cb();
    });
}, function(err) {

    console.log(result);
    database.close();
})
