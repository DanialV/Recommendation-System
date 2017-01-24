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
let template  = [];
let hash_index = {};
fs.readFile('movies.dat', 'utf8', function(err, allData) {
    let each_movie = allData.split('\n');
    let counter = 0;
    each_movie.forEach(function(index) {
        let movie_array = index.split('::');
        let movie_name = movie_array[1];
        let movie_id = movie_array[0];
        let each_movie_schema = {};
        if (index != '') {
            each_movie_schema.movie_id = movie_id;
            each_movie_schema.rate =  parseInt("NAN Value");
            hash_index[movie_id] = counter;
            counter++;
            template.push(each_movie_schema);
        }
    });
    let each_data = {
      'user_id':"0",
      'movie_rate':template
    }
    let db_save = new db.rates(each_data);
    db_save.save(function(err) {
        if (err) {
            return console.log(err);
        }
        database.close();
    });
});
// fs.readFile('ratings.dat', 'utf8', function(err, data) {
//     let user_rating = data.split('\n');
//     let each_data = {};
//     async.each(user_rating,function(index,cb) {
//         let movie_info = index.split(',');
//         if (each_data.user_id == movie_info[0]) {
//             each_data.user_id = movie_info[0];
//             let movie_index = hash_index[movie_info[1]];
//             each_data.movie_rate[movie_index].rate = Number(movie_info[2]);
//         } else {
//             if (typeof each_data.user_id != 'undefined') {
//                 let db_save = new db.rates(each_data);
//                 db_save.save(function(err) {
//                     if (err) {
//                         return console.log(err);
//                     }
//                     if(each_data.user_id == "6040")
//                       database.close();
//                     cb();
//                 });
//             }
//             if(index != ''){
//               each_data = {};
//               each_data.movie_rate = template.slice();
//               each_data.user_id = movie_info[0];
//               let movie_index = hash_index[movie_info[1]];
//               each_data.movie_rate[movie_index].rate = Number(movie_info[2]);
//             }
//         }
//     });
// });
