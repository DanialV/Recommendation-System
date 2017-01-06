var app = angular.module('app', ['ngRoute', 'http_engine', 'star_rating']);
app.config(function($routeProvider) {});
app.controller('main_controller', function($scope, http) {
        $scope.rate1 = 1;
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
            $scope.user_data.session = data.session;
            $scope.user_data.name = data.name;
            $scope.user_data.recom_movie = data.recom_movie;
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
                    $scope.user_data.session = true;
                    $scope.user_data.name = data.name;
                    $scope.user_data.recom_movie = data.recom_movie;
                    console.log(data.recom_movie);
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
                    toastr.success('با موفقیت ثبت نام شدید');
                    $('#myModal').modal('toggle');

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


        $scope.starRating1 = 4;
        $scope.starRating2 = 5;
        $scope.starRating3 = 2;
        $scope.hoverRating1 = $scope.hoverRating2 = $scope.hoverRating3 = 0;

        $scope.click1 = function(param) {};

        $scope.mouseHover1 = function(param) {
            $scope.hoverRating1 = param;
        };

        $scope.mouseLeave1 = function(param) {
            $scope.hoverRating1 = param + '*';
        };

        $scope.click2 = function(param) {};

        $scope.mouseHover2 = function(param) {
            $scope.hoverRating1 = param;
        };

        $scope.mouseLeave2 = function(param) {
            $scope.hoverRating2 = param + '*';
        };

        $scope.click3 = function(param) {};

        $scope.mouseHover3 = function(param) {
            $scope.hoverRating3 = param;
        };

        $scope.mouseLeave3 = function(param) {
            $scope.hoverRating3 = param + '*';
        };
    }).directive("owlCarousel", function() {
        return {
            restrict: 'E',
            transclude: false,
            link: function(scope) {
                scope.initCarousel = function(element) {
                    // provide any default options you want
                    var defaultOptions = {};
                    var customOptions = scope.$eval($(element).attr('data-options'));
                    // combine the two options objects
                    for (var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    // init carousel
                    $(element).owlCarousel(defaultOptions);
                };
            }
        };
    })
    .directive('owlCarouselItem', [function() {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    }]);
