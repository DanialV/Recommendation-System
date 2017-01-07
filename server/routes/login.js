/**
 * Created by danial on 8/26/16.
 */
var db = require("mongo_schemas");
var ascync = require("async");
var bcrypt = require("bcrypt");
var form = require('form_validation');
var async = require('async');
var recommended = require('recommended_movie')
module.exports.post = function(req, res) {
    var data = req.body;
    ascync.waterfall([
        function check_input(cb) {
            let isFormValid = (form.isValid(data.username) &&
                form.isValid(data.password));
            let error = {
                'status': false
            }
            if (isFormValid) {
                return (cb(null, true));
            }
            return (cb(err, null));

        },
        function check_password(res_data, callback) {
            db.users.findOne({
                username: data.username
            }, {}).lean().exec(function(err, user_data) {
                if (err) {
                    console.mongo('Error', err);
                    return (callback(err, null));
                }
                if (user_data == null) {
                    console.mongo('Info', 'Unsuccessful login wrong Username : ' + data.username + ' password: ' + data.password);
                    return (callback({
                        status: false
                    }, null));
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
                        console.log(user_data);
                        res_data.name = user_data.first_name + " " + user_data.last_name;
                        res_data._id = user_data._id.toString();
                        res_data.status = true;
                        return (callback(null, res_data));
                    }
                    console.mongo('Info', 'Unsuccessful login wrong password Username : ' + user_data.username);
                    res_data.status = false;
                    return (callback(res_data, null));
                });
            });
        },
        function find_recommended_movie(res_data, cb) {
            recommended.get_recommended(res_data._id, function(err, movies) {
                if (err) {
                    return (cb(err, null));
                }
                //recom_movie.name = res_data.name;
                res_data.recom_movie = movies.recom_movie;
                return (cb(null, res_data))
            });
        }
    ], function(err, result) {
        if (err) {
            if (err.status == false) {
                return res.json(err);
            }
            console.mongo('Error', err);
            return res.sendStatus(500);
        }
        res.json(result);
    });
};
