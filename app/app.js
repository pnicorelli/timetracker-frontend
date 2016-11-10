(function() {
  'use strict';

  var TimeTracker = angular
  .module('TimeTracker', [
    // vendors modules
    'ngRoute',
    'ngStorage',
    'ngResource',
    'llNotifier',
    'smart-table',
    'monospaced.qrcode',
    'datePicker',
    'ngSanitize',
    'ngCsv',

    //App modules
    'TimeTracker.header',
    'TimeTracker.home',
    'TimeTracker.login',
    'TimeTracker.members',
    'TimeTracker.notify',
    'TimeTracker.report',
    'TimeTracker.forbidden'

  ]);

  TimeTracker.config(config);

  function config( $routeProvider, $httpProvider, $localStorageProvider, stConfig){
    $httpProvider.defaults.cache = true;
     $httpProvider.interceptors.push('myHttpInterceptor');
      $routeProvider.otherwise({
          redirectTo: function() {
              window.location = '#/';
          }
      });

      stConfig.pagination.template = 'view/shared/smart-table/custom-pagination-tmpl.html';
   };

 TimeTracker.run(run);

 function run($localStorage, $rootScope){

 }

})();
