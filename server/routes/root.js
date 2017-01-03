/**
 * Created by danial on 7/27/16.
 */
//PLANNING: change the Site UI
var error_handel = require("djs");
var db = require('mongo_schemas');
var get_routes = ['/get_menu','/main_content','/logout','/','/user_management'];
var post_route = ['/favorite','/deletenumber','/editnumber','/login' ,'/add_phone','/enroll','/delfavorite',
    '/edit_user',
    '/deluser',
    '/forget_password'
];
function handel_permissions(req, res, next) {
    if(post_route.indexOf(req.url) == -1 && get_routes.indexOf(req.url) == -1){
      res.status(404).json({
        status:404
      });
    }
    if (typeof req.session._id != 'undefined') {
        db.users.findOne({
            _id: req.session._id
        }, {}).lean().exec(function(err, data) {
            if (err) {
                console.mongo('Error', err);
                return;
            }
            req.user = {};
            req.user.permissions = data.permissions;
            req.user.username = data.username;
            req.user.name = data.first_name + ' ' + data.last_name;
            next();
        });
    } else {
        next();
    }
}
module.exports = function(app) {
    app.route('/*').get(function(req, res, next) {
        handel_permissions(req, res, next);
    }).post(function(req, res, next) {
        handel_permissions(req, res, next);
    });
    require('./dynamic_routes')(app);
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            console.mongo('Error', err);
            res.status(err.status || 500);
        });
    }
    app.use(function(err, req, res, next) {
        console.mongo('Error', err);
        res.status(err.status || 500);
    });
};
