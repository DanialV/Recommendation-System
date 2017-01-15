var db = require('mongo_schemas');
var async = require('async');
module.exports.post = function(req, res) {
    let data = req.body;
    //TODO:check input validation
    //TODO:first find element with movie id then update or if result is null insert it to array
    async.parallel([
        function(cb) {
            db.rates.update({
                _id: req.user.session
            }, {
                'rate': data.rate,
                'movie_id': data.movie_id
            }, {
                upsert: true
            }, function(err) {
                if (err) {
                    console.mongo('Error', err);
                    return (cb(err, null));
                }
                return (cb(null, true));
            });
        },
        function(cb) {
            db.update({
                _id: user
            })
        }
    ], function(err, results) {

    });
};
