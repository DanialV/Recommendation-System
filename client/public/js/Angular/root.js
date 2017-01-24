var app = angular.module('app', ['ngRoute', 'http_engine', 'star_rating', 'owl', 'user_rated_movie']);
app.config(function($routeProvider) {});
app.controller('main_controller', function($scope, http, user_rated) {
    $scope.user_data = {};
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
            var owl = $("#owl1");
            owl.owlCarousel({
                autoPlay: 3000,
                itemsDesktop: [640, 4],
                itemsDesktopSmall: [414, 3]
            });
            owl.data('owlCarousel').destroy();
            $scope.user_data.recom_movie = data.recom_movie;
        }
        $scope.user_data.session = data.session;
    });
    user_rated.get(function(info) {
        $scope.user_data.rated_movie = info;
    });
    $scope.logout = function() {
        http.get('/logout', {}, function(err, data) {
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            }
            location.replace('/');
        });
    }
    $scope.rateMovie = function(movie_id, param) {
        var data = {};
        data.rate = param;
        data.movie_id = movie_id;
        http.post('/rate', data, function(err, data) {
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            }
            if (data.status == true) {
                toastr.success('امتیاز با موفقیت ثبت شد', 'ثبت');
                var owl = $("#owl1");
                owl.data('owlCarousel').destroy();
                $scope.user_data.recom_movie = data.recom_movie;
                user_rated.get(function(info) {
                    $scope.user_data.rated_movie = info;
                });

            }
        });
    }
    $scope.change_rate = function(movie_id, param) {
        var data = {};
        data.rate = param;
        data.movie_id = movie_id;
        http.post('/change_rate', data, function(err, data) {
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            }
            if (data.status == true) {
                toastr.info('امتیاز با موفقیت تغییر کرد', 'ویرایش');
            }
        });
    }
    $scope.update_recom = function() {
        http.get('/core', function(err, data) {
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            }
            var owl = $("#owl1");
            owl.owlCarousel({
                autoPlay: 3000,
                itemsDesktop: [640, 4],
                itemsDesktopSmall: [414, 3]
            });
            owl.data('owlCarousel').destroy();
            $scope.user_data.recom_movie = data.recom_movie;
        })
    }
});
