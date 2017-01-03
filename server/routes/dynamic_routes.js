/**
 * Created by danial on 7/28/16.
 */
 //TODO: add Logs post route and user edit profile
var _route = require("djs");
var get_routes = [

];
var post_route = [

];
module.exports = function(app){
    get_routes.forEach(function(index){
        _route.file_get(app,index);
    });
    post_route.forEach(function(index){
        _route.file_post(app,index);
    });
};
