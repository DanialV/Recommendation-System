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
    $scope.send_login = function() {
        http.post('/login', $scope.login_data, function(err, data) {
            $scope.login_data = {};
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            }
            if (data.status == true) {
                $('#myModal').modal('toggle');
                toastr.success('با موفقیت وارد شدید.', 'خوش آمدید.');
            } else {
                toastr.error('نام کاربری یا رمز عبور اشتباه است', 'خطا');
            }

        });
    };
    $scope.send_enroll = function() {
        http.post('/enroll', $scope.enroll_data, function(err, data) {
            $scope.enroll_data = {};
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            }
            if (data.status == true) {
                toastr.success(data.message);

            } else {
                toastr.error(data.message, 'خطا');
            }
        });
    };
    $scope.logout = function() {
        http.get('/logout', {}, function(err, data) {
            if (err) {
                return toastr.error('اشکال داخلی سرور', 'خطا');
            } else {
                $scope.user_data.session = false;
            }
        });
    }

    $scope.starRating1 = 0;
    $scope.rateMovie = function(movie_id, param) {
        alert(movie_id + " " + param);
    }
});
