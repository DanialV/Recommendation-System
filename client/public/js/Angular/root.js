var app = angular.module('app', ['ngRoute', 'http_engine']);
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
        $scope.user_data.session = data.session;
        $scope.user_data.name = data.name;
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
        })
    }
});;
