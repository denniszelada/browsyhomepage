/**
 * Authentication module, redirects to homepage if not logged in
 */

angular.module('common.authentication', [])

.config(function($httpProvider){
  // Intercepts every http request.  If the response is success, pass it through.
  // If the response is an
  // error, and that error is 401 (unauthorised) then the user isn't logged in,
  // redirect to the login page
  var interceptor = function($q, $location, $rootScope) {
    return {
      'request': function(config) {
        if((config.url.indexOf("partials/home/_home.html") > -1) ||
            (config.url.indexOf("sign_in") > -1) ||
            (config.url.indexOf("users.json") > -1)){
          // Do nothing because it's a local call
        }else{
          if($rootScope.current_user){
            $rootScope.unauthorized_access = false;
          }else{
            $rootScope.unauthorized_access = true;
          }
        }
        return config;
      },
      'responseError': function(rejection) {
        if (rejection.status == 401) {
          if (rejection.data.error == "You need to sign in or sign up before continuing.") {
            $rootScope.$broadcast('event:unauthorized');
            $rootScope.unauthorized_access = true;
          }
        }
        return $q.reject(rejection);
      }
    };
  };
  $httpProvider.interceptors.push(interceptor);
});
