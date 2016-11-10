(function() {
  'use strict';

  angular
  .module('TimeTracker.login')
  .factory('LoginService', LoginService);

  LoginService.$inject = ['API', '$localStorage', '$q', '$http'];

  function LoginService(API, $localStorage, $q, $http) {
    return {
      signIn: singIn,    //perform Login on api server and save on localStorage
      signOut: signOut,    //remove user's data from localStorage
      isLogged: isLogged    //just check if user's data is on localStorage
    }


    ///////////////////////////////
    // functions implementations //
    ///////////////////////////////

    function singIn(username, password) {
      var deferred = $q.defer();
      var credentials = {
        grant_type: 'password',
        username: username,
        password: password
      };
      $http.post(API.url + '/v1/accounts/login', credentials)
        .then(
          function success(response){
            if( response.status === 201 ){
              $localStorage.token = response.data.token;
              $localStorage.isLogged = true;
              setProfile().then( function(){
                return deferred.resolve(response);
              })
            } else {
              return deferred.reject(response);
            }
          },
          function error(response){
            return deferred.reject(response);
          });
      return deferred.promise;
    }

    function signOut(){
      delete $localStorage.token;
      $localStorage.isLogged = false;
      return true;
    }

    function isLogged(){
      return $localStorage.isLogged || false;
    }

    function setProfile(){
      var deferred = $q.defer();
      $http.get(API.url + '/v1/accounts/profile')
        .then(
          function success(response){
            console.log( response )
            $localStorage.profile = response.data.profile;
            $localStorage.userId = response.data.profile._id;
            return deferred.resolve();
          },
          function error(err){
            return deferred.reject(err);
          }
      )
      return deferred.promise;
    }
  }
})();
