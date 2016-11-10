(function() {
  'use strict';

  angular
  .module('TimeTracker.header')
  .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$rootScope', '$routeParams', 'LoginService', '$localStorage', 'NotifyService', '$location'];

  function HeaderController($rootScope, $routeParams, LoginService, $localStorage, NotifyService, $location) {
    var vm = this;
    vm.username = '';

    render();

    $rootScope.$on('header.render', render);

    function render(event){
      if( LoginService.isLogged() ){
        vm.template = 'view/components/header/header_auth.html';
        vm.username = $localStorage.profile.username;
        vm.company = $localStorage.profile.company;
      } else {
        vm.template = 'view/components/header/header_noauth.html';
      }
    }


    vm.login = function(){
      LoginService.signIn(vm.username, vm.password)
        .then( function(res){
          $rootScope.$broadcast('header.render', '');
        })
        .catch( function(err){
          NotifyService.flash('username o password errate', 'error');
        });
    };

    vm.logout = function(){
      if( LoginService.signOut() ){
        $rootScope.$broadcast('header.render', '');
        $location.path('/');
      }
    };

  }
})();
