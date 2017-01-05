/**
 * Created by danial on 8/26/16.
 */
var db = require("mongo_schemas");
var ascync = require("async");
var bcrypt = require("bcrypt");
module.exports.post = function(req, res) {
    var data = req.body;
    ascync.waterfall([
        function check_password(callback) {
            db.users.findOne({
                username: data.username
            }, {}).lean().exec(function(err, user_data) {
                if (err) {
                    console.mongo('Error', err);
                    return (callback(err, null));
                }
                if (user_data == null) {
                    console.mongo('Info', 'Unsuccessful login wrong Username : ' + data.username + ' password: ' + data.password);
                    return (callback(null, {
                        status: false
                    }));
                }
                bcrypt.compare(data.password, user_data.password, function(err, hash_res) {
                    if (err) {
                        console.mongo('Error', err);
                        return (callback(err, null));
                    }
                    let res_data = {};
                    if (hash_res) {
                        console.mongo('Info', 'Successfull login Username : ' + user_data.username);
                        req.session._id = user_data._id;
                        res_data.name = user_data.first_name + " " + user_data.last_name;
                        res_data.status = true;
                        return (callback(null, res_data));
                    }
                    console.mongo('Info', 'Unsuccessful login wrong password Username : ' + user_data.username);
                    res_data.status = false;
                    return (callback(null, res_data));
                });
            });
        }
    ], function(err, result) {
        if (err) {
            console.mongo('Error', err);
            return res.sendStatus(500);
        }
        res.send(result);
    });
};
