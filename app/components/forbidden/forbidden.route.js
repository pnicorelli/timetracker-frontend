(function(){
  'use strict';
  angular
  .module('TimeTracker.forbidden')
  .config(config);

  function config($routeProvider){
    $routeProvider
    .when('/forbidden', {
      templateUrl: 'view/components/forbidden/forbidden.html',
      controller: 'ForbiddenController',
      controllerAs: 'vm'
    });
  };

})();
