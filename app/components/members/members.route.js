(function(){
  'use strict';
  angular
  .module('TimeTracker.members')
  .config(config);

  function config($routeProvider, $localStorageProvider){
    $routeProvider
    .when('/members', {
      templateUrl: 'view/components/members/list.html',
      controller: 'MembersController',
      controllerAs: 'vm',
      resolve: {
        auth: function($location){
          if( !$localStorageProvider.get('isLogged') ){
            $location.path('/forbidden');
          }
        }
      }
    })
    .when('/members/:memberId', {
      templateUrl: 'view/components/members/detail.html',
      controller: 'MembersController',
      controllerAs: 'vm',
      resolve: {
        auth: function($location){
          if( !$localStorageProvider.get('isLogged') ){
            $location.path('/forbidden');
          }
        }
      }
    })
    .when('/add_member', {
      templateUrl: 'view/components/members/create.html',
      controller: 'MembersController',
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
