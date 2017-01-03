module.exports.get = function(req, res) {
    return res.json({
        'session': req.user.session,
        'name': req.user.name
    });
}
