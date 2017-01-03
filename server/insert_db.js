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
let number_of_rates = 6040;
fs.readFile('ratings.dat', 'utf8', function(err, data) {
    let user_rating = data.split('\n');
    user_rating.shift();
    let each_data = {};
    let counter = 0;
    user_rating.forEach(function(index) {
        let temp = index.split(',');
        if (each_data.user_id == temp[0]) {
            each_data.user_id = temp[0];
            each_data.movie_rate.push({
                'movie_id': temp[1],
                'rate': temp[2]
            });
        } else {
            if (typeof each_data.user_id != 'undefined') {
                let db_save = new db.rates(each_data);
                db_save.save(function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    counter++;
                    if (counter == number_of_rates) {
                        database.close();
                    }

                });
            }
            each_data = {};
            each_data.user_id = temp[0];
            each_data.movie_rate = [];
            each_data.movie_rate.push({
                'movie_id': temp[1],
                'rate': temp[2]
            });
        }
    });
});
