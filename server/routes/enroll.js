/**
 * Created by danial on 9/9/16.
 */
var db = require("mongo_schemas");
var async = require("async");
var bcrypt = require("bcrypt");
var error = require('djs');
var form = require('form_validation');
module.exports.post = function(req, res) {
    let data = req.body;
    let isFormValid = (form.isValid(data.username) &&
        form.isValid(data.first_name) &&
        form.isValid(data.last_name) &&
        form.isValid(data.email) &&
        form.isValid(data.password));
    if (!isFormValid) {
        let res_data = {
            'status': false,
            'message': 'تمامی فیلد های فرم باید کامل شود'
        }
        return res.json(res_data);
    }
    async.waterfall([
        check_username,
        check_email,
        save_result
    ], function(err, result) {
        if (err) {
            return error.error_handel(res, err, 500, 'internal server error');
        }
        res.json(result);
    });

    function check_username(callback) {
        db.users.count({
            username: data.username
        }).lean().exec(function(err, username) {
            if (err) {
                console.mongo(err);
                return (callback(err, null));
            }
            let res_data = {};
            if (username) {
                res_data.status = false;
                res_data.message = 'نام کاربری قبلا در سیستم ثبت شده است';
                return (callback(null, res_data));
            }
            res_data.status = true;
            return (callback(null, res_data));
        });
    }

    function check_email(res_data, callback) {
        if (res_data.status) {
            db.users.count({
                email: data.email
            }).lean().exec(function(err, email) {
                if (err) {
                    console.mongo(err);
                    return (callback(err, null));
                }
                let res_data = {};
                if (email) {
                    res_data.status = false;
                    res_data.message = 'ایمیل قبلا در سیستم ثبت شده است';
                    return (callback(null, res_data));
                }
                res_data.status = true;
                return (callback(null, res_data));
            });
        } else callback(null, res_data);
    }

    function save_result(res_data, callback) {
        if (res_data.status) {
            bcrypt.hash(data.password, 10, function(err, hash) {
                if (err) {
                    console.log(err);
                    return (callback(err, null));
                }
                data.password = hash;
                var saveModule = new db.users(data);
                saveModule.save(function(err) {
                    let res_data = {
                        'status': true
                    };
                    if (err) {
                        console.mongo(err);
                        return (callback(err, null));
                    }
                    return (callback(null, res_data));
                });
            });
        } else callback(null, res_data);
    }
};
