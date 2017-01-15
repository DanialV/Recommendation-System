var app = angular.module('app', ['ngRoute', 'http_engine', 'star_rating', 'owl']);
app.config(function($routeProvider) {});
app.controller('main_controller', function($scope, http) {
    $scope.user_data = {
        'navbar': false
    };
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    http.get('/init', {}, function(err, data) {
        if (err) {
            return toastr.error('اشکال داخلی سرور', 'خطا');
        }
        if (data.session) {
            $scope.user_data.name = data.name;
            let owl = $(".owl-carousel");
            owl.owlCarousel({
                autoPlay: 3000,
                itemsDesktop: [640, 4],
                itemsDesktopSmall: [414, 3]
            });
            owl.data('owlCarousel').destroy();

            $scope.user_data.recom_movie = data.recom_movie;
            $scope.user_data.recom_movie2 = [data.recom_movie[6], data.recom_movie[1],
                data.recom_movie[2], data.recom_movie[3], data.recom_movie[4], data.recom_movie[5]
            ];
        }
        $scope.user_data.session = data.session;
        $scope.user_data.navbar = true;
    });
    $scope.logout = function() {
        http.get('/logout', {}, function(err, data) {
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            } else {
                location.replace('/');
            }
        });
    }

    $scope.starRating1 = 0;
    $scope.rateMovie = function(movie_id, param) {
        alert(movie_id + " " + param);
    }
});
