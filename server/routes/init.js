var recommended = require('recommended_movie');
module.exports.get = function(req, res) {
    if (req.user.session) {
        recommended.get_recommended(req.user.session.toString(), function(err, data) {
            if (err) {
                if (err.status == false) {
                    return res.json(err);
                }
                console.mongo('Error', err);
                return res.sendStatus(500);
            } else {

                return res.json({
                    'session': req.user.session,
                    'name': req.user.name,
                    'recom_movie': data.recom_movie
                });
            }
        });

    } else {
        return res.json({
            'session': req.user.session
        });
    }

}
