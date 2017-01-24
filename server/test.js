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
var aggregation = db.rates.aggregate(
    [{
        $match: {
            $or: [{
                user_id: "5883d61562d3cd4a0ba199cd"
            }, {
                user_id: "2"
            }]
        }
    }, {
        $project: {
            _id: 0,
            'movie_id': "$movie_rate.movie_id",
            'rate': "$movie_rate.rate"
        }
    }]);
aggregation.options = {
    allowDiskUse: true
};
aggregation.exec(function(err, info) {
    console.log(info);
    database.close();
});
