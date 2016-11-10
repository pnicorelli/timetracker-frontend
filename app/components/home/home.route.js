(function(){
  'use strict';
  angular
  .module('TimeTracker.home')
  .config(config);

  function config($routeProvider){
    $routeProvider
    .when('/', {
      templateUrl: 'view/components/home/home.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    });
  };

})();
