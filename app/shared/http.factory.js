(function() {
    'use strict';

    angular
        .module('TimeTracker')
        .factory('myHttpInterceptor', myHttpInterceptor);

    myHttpInterceptor.$inject = ['API', '$localStorage'];

    function myHttpInterceptor(API, $localStorage) {
        var service = {
            request: request
        };

        return service;

        ///////////////////////////////
        // functions implementations //
        ///////////////////////////////

        function request(config) {
          // config.headers['Content-Type'] = 'application/json';
          if ( $localStorage.isLogged ) {
                config.headers.Authorization = 'Bearer '+$localStorage.token;
          }

          return config;
        }
    }
})();
