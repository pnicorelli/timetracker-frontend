(function(){
  'use strict';
  angular
  .module('TimeTracker.report')
  .config(config);

  function config($routeProvider, $localStorageProvider){
    $routeProvider
    .when('/timeSheet/report/:when', {
      templateUrl: 'view/components/report/report.html',
      controller: 'ReportController',
      controllerAs: 'vm',
      resolve: {
        auth: function($location){
          if( !$localStorageProvider.get('isLogged') ){
            $location.path('/forbidden');
          }
        }
      }
    });
  };

})();
