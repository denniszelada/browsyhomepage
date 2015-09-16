'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('HomeCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  	$scope.boom = "hola :)";

  }])
  .controller('BoardListCtrl', ['$scope', '$routeParams', '$location', '$rootScope', 'Board', function($scope, $routeParams, $location, $rootScope, Board) {
  	$scope.grettings = "hola listing boards!";

  	// Get boards
    $scope.current_user = $routeParams.username

    if($scope.current_user == 'jubele'){
      $location.path('/' + $scope.current_user + '/featured-pins/pins');
    }

  	$scope.boards = Board.query({username: $routeParams.username});
  	$scope.board = Board.query({username: $routeParams.username, board_slug: $routeParams.board_slug});

  }])
  .controller('PinListCtrl', ['$scope', '$routeParams', 'Board', 'Pin', function($scope, $routeParams, Board, Pin) {
  	// Get pins
    $scope.current_user = $routeParams.username
    $scope.board = Board.query({username: $routeParams.username, board_slug: $routeParams.board_slug});
  	//$scope.pins = Pin.query({username: $routeParams.username, board_slug: $routeParams.board_slug});

    // test
    $scope.pins = Pin.query({username: $routeParams.username, board_slug: $routeParams.board_slug}, function() {
      $scope.set_abcd_arrays($scope.pins);
    });


  	$scope.pin = Pin.query({username: $routeParams.username, board_slug: $routeParams.board_slug, pin_id: $routeParams.pin_id});

    $scope.set_abcd_arrays = function(items) {
      var a_pins = [];
      var b_pins = [];
      var c_pins = [];
      var d_pins = [];
      var switcher = 0;

      for(var i=0; i<items.length; ++i) {
        switch(switcher) {
          case 0:
              a_pins.push(items[i]);
              switcher++;
              break;
          case 1:
              b_pins.push(items[i]);
              switcher++;
              break;
          case 2:
              c_pins.push(items[i]);
              switcher++;
              break;
          case 3:
              d_pins.push(items[i]);
              switcher = 0;
              break;
        }
      }

      $scope.a_pins = a_pins;
      $scope.b_pins = b_pins;
      $scope.c_pins = c_pins;
      $scope.d_pins = d_pins;

    };

  }])
  .controller('ProductListCtrl', ['$scope', '$routeParams', 'Pin', 'Product', function($scope, $routeParams, Pin, Product) {
  	// Get products
    $scope.current_user = $routeParams.username
    $scope.board_slug = $routeParams.board_slug
    $scope.pin = Pin.query({username: $routeParams.username, board_slug: $routeParams.board_slug, pin_id: $routeParams.pin_id});
    $scope.products = Product.query({username: $routeParams.username, board_slug: $routeParams.board_slug, pin_id: $routeParams.pin_id});

  }])
  .controller('SortProductListCtrl', ['$scope', '$routeParams', 'GlobalProduct', function($scope, $routeParams, GlobalProduct) {
    // Get products global index
    $scope.current_user = $routeParams.username
    $scope.board_slug = $routeParams.board_slug

    // Groups products
    $scope.products = GlobalProduct.query({ username: $routeParams.username, order: 'asc' }, function() {
      $scope.set_abcd_arrays($scope.products);
    });
    $scope.sort_name = "Lowest Price"

    $scope.set_asc_products = function() {
      $scope.sort_name = "Lowest Price"
      $scope.products = GlobalProduct.query({ username: $routeParams.username, order: 'asc' }, function() {
        $scope.set_abcd_arrays($scope.products);
      });
      //$scope.$apply(set_asc_products);
    };

    $scope.set_desc_products = function() {
      $scope.sort_name = "Highest Price"
      $scope.products = GlobalProduct.query({ username: $routeParams.username, order: 'desc' }, function() {
        $scope.set_abcd_arrays($scope.products);
      });
    };

    $scope.set_by_discount_products = function() {
      $scope.sort_name = "Discount"
      $scope.products = GlobalProduct.query({ username: $routeParams.username, order: 'discount' }, function() {
        $scope.set_abcd_arrays($scope.products);
      });
    };

    $scope.set_abcd_arrays = function(items) {
      var a_products = [];
      var b_products = [];
      var c_products = [];
      var d_products = [];
      var switcher = 0;

      for(var i=0; i<items.length; ++i) {
        switch(switcher) {
          case 0:
              a_products.push(items[i]);
              switcher++;
              break;
          case 1:
              b_products.push(items[i]);
              switcher++;
              break;
          case 2:
              c_products.push(items[i]);
              switcher++;
              break;
          case 3:
              d_products.push(items[i]);
              switcher = 0;
              break;
        }
      }

      $scope.a_products = a_products;
      $scope.b_products = b_products;
      $scope.c_products = c_products;
      $scope.d_products = d_products;

    };

  }])
  .controller('LoginCtrl', ['$rootScope', '$scope', '$routeParams', '$http', '$location', '$analytics', 'User', function($rootScope, $scope, $routeParams, $http, $location, $analytics, User) {
    $scope.login_user = {email: null, password: null};
    $scope.login_error = {message: null, errors: {}};

    $scope.register_user = {email: null, password: null, password_confirmation: null};
    $scope.register_error = {message: null, errors: {}};
    var base_url = 'http://localhost:3020/v1/';

    $scope.removeLastUrlPart = function(url) {
      var lastSlashIndex = url.lastIndexOf("/");
      if (lastSlashIndex > url.indexOf("/") + 1) { // if not in http://
        return url.substr(0, lastSlashIndex); // cut it off
      } else {
        return url;
      }
    };

    $scope.login = function() {
      $scope.submit({method: 'POST',
                     url: base_url + 'users/sign_in',
                     data: {user: {email: $scope.login_user.email, password: $scope.login_user.password}},
                     success_message: "You have been logged in.",
                     error_entity: $scope.login_error});
    };

    $scope.logout = function() {
      $scope.submit({method: 'DELETE',
                   url: base_url + 'users/sign_out',
                   success_message: "You have been logged out.",
                   error_entity: $scope.login_error});
    };

    // ================== Register User methods
    $scope.password_reset = function () {
    $scope.submit({method: 'POST',
                   url: base_url + 'users/password',
                   data: {user: {email: $scope.login_user.email}},
                   success_message: "Reset instructions have been sent to your e-mail address.",
                   error_entity: $scope.login_error});
    };

    $scope.unlock = function () {
      $scope.submit({method: 'POST',
                     url: base_url + 'users/unlock',
                     data: {user: {email: $scope.login_user.email}},
                     success_message: "An unlock e-mail has been sent to your e-mail address.",
                     error_entity: $scope.login_error});
    };

    $scope.confirm = function () {
      $scope.submit({method: 'POST',
                     url: base_url + 'users/confirmation',
                     data: {user: {email: $scope.login_user.email}},
                     success_message: "A new confirmation link has been sent to your e-mail address.",
                     error_entity: $scope.login_error});
    };

    $scope.register = function() {

      if($scope.no_pinterest_checked){
        // This is for non pinterest users
        $scope.register_user.user_name = $scope.register_user.email;
      }else{
        // Pinterest URL cleaner
        var lastPart = $scope.register_user.user_name.substr($scope.register_user.user_name.lastIndexOf('/') + 1);
        if (lastPart === "") {
          // Show your overlay
          console.log("cropped url: "+ $scope.removeLastUrlPart($scope.register_user.user_name));
          var pinterest_url_array = $scope.removeLastUrlPart($scope.register_user.user_name).split('/');
        }else{
          var pinterest_url_array = $scope.register_user.user_name.split('/');
        }

        $scope.register_user.user_name = pinterest_url_array[pinterest_url_array.length-1];
        if ($scope.register_user.user_name == 'www.pinterest.com'){
          // invalid pinterest url
          $scope.register_user.user_name = '';
        }
      }

      $scope.submit({method: 'POST',
                     url: base_url + 'users',
                     data: {user: {email: $scope.register_user.email,
                                   user_name: $scope.register_user.user_name,
                                   first_name: $scope.register_user.first_name,
                                   last_name: $scope.register_user.last_name,
                                   password: $scope.register_user.password,
                                   password_confirmation: $scope.register_user.password_confirmation}},
                     success_message: "You have been registered and logged in.  A confirmation e-mail has been sent to your e-mail address, your access will terminate in 2 days if you do not use the link in that e-mail.",
                     error_entity: $scope.register_error});
    };

    $scope.change_password = function() {
      $scope.submit({method: 'PUT',
                     url: base_url + 'users/password',
                     data: {user: {email: $scope.register_user.email,
                                   password: $scope.register_user.password,
                                   password_confirmation: $scope.register_user.password_confirmation}},
                     success_message: "Your password has been updated.",
                     error_entity: $scope.register_error});
    };


    // ================== Submit method

    $scope.submit = function(parameters) {
    $scope.reset_messages();
    $scope.signup_third_step = false;

    $http({method: parameters.method,
           url: parameters.url+ '.json',
           data: parameters.data})
      .success(function(data, status){
        console.log("==> status: "+status);
        if (status == 201 || status == 204){

          parameters.error_entity.message = parameters.success_message;

          $rootScope.current_user = data.user_name;

          $scope.reset_users();

          $('.close-reveal-modal').click();
          $('.reveal-modal-bg').hide();

          $location.path('/' + $rootScope.current_user);
        } else {
          console.log("==> status error: "+status);
          if (data.error) {
            parameters.error_entity.message = data.error;
            if(parameters.error_entity.message){
              $scope.signup_third_step = true;
              $('#facebook_conversion_pixels').append('<!--Facebook Conversion Code for Successful Sign Up--><script>(function(){var _fbq=window._fbq||(window._fbq=[]);if(!_fbq.loaded){var fbds=document.createElement("script");fbds.async=true;fbds.src="//connect.facebook.net/en_US/fbds.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(fbds,s);_fbq.loaded=true}})();window._fbq=window._fbq||[];window._fbq.push(["track","6015346557428",{"value":"0.00","currency":"USD"}]);</script>');
              $scope.conversion_pixels_html = '<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=6015346557428&amp;cd[value]=0.00&amp;cd[currency]=USD&amp;noscript=1" /></noscript>';

              // Notify GA
              if(parameters.url == (base_url + 'users')){
                console.log("label with user user: ", parameters.data.user.user_name);
                $analytics.eventTrack('Convert', {  category: 'Signup', label: parameters.data.user.user_name });
              }

            }
          } else {
            // note that JSON.stringify is not supported in some older browsers, we're ignoring that
            parameters.error_entity.message = "Success, but with an unexpected success code, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: " + JSON.stringify(data);
          }
        }
      })
      .error(function(data, status){
        //console.log("stringify data: "+JSON.stringify(data.errors));
        //console.log("status: "+status);
        if (status == 422) {
          parameters.error_entity.errors = data.errors;
        } else {
          if (data.error) {
            parameters.error_entity.message = data.error;
          } else {
            // note that JSON.stringify is not supported in some older browsers, we're ignoring that
            parameters.error_entity.message = "Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: " + JSON.stringify(data);
          }
        }
      });
    };

    $scope.reset_messages = function() {
      $scope.login_error.message = null;
      $scope.login_error.errors = {};
      $scope.register_error.message = null;
      $scope.register_error.errors = {};
    };

    $scope.reset_users = function() {
      $scope.login_user.email = null;
      $scope.login_user.password = null;
      $scope.register_user.email = null;
      $scope.register_user.user_name = null;
      $scope.register_user.password = null;
      $scope.register_user.password_confirmation = null;
    };

  }])
  .controller('AuthCtrl', ['$scope', '$routeParams', '$location', '$rootScope', function($scope, $routeParams, $location, $rootScope) {
    $rootScope.unauthorized_access = false;

    $scope.open = function() {
      $rootScope.unauthorized_access = true;
    };

    $scope.ok = function() {
      $rootScope.unauthorized_access = false;
    };

    $scope.cancel = function() {
      $rootScope.unauthorized_access = false;
    };

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
