//this is query find top rated movie written by me and my best firend elyas|github.com/elyas74
db.top_rated_movie.drop();
db.getCollection('rates').aggregate([{
        $match: {}
    }, {
        $project: {
            _id: 0,
            movie_rate: 1,
            user_id: 1
        }
    }, {
        $unwind: "$movie_rate"
    }, {
        $group: {
            _id: "$movie_rate.movie_id",
            avg_r: {
                $avg: "$movie_rate.rate"
            },
            count_v: {
                $sum: 1
            }
        }
    }, {
        $project: {
            _id: 1,
            avg_r: 1,
            count_v: 1,
            weight_rate: {
                $divide: [{
                    $add: [{
                        $multiply: ["$count_v", "$avg_r"]
                    }, {
                        $multiply: [269.88909875877, 3.23889217791089]
                    }]
                }, {
                    $add: ["$count_v", 269.88909875877]
                }]
            }
        }
    },
    // sort
    {
        $sort: {
            weight_rate: -1
        }
    }, {
        $out: "top_rated_movie"
    }

]);

// dalghak 2 generator
// db.getCollection('dalghak').aggregate([{
//         $group: {
//             _id: "1",
//
//             C: {
//                 $avg: "$avg_r"
//             },
//             M: {
//                 $avg: "$count_v"
//             }
//         }
//     }, // out to db
//     {
//         $out: "dalghak2"
//     }
// ]);
