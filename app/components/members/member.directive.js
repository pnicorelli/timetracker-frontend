(function() {
    'use strict';

    angular
        .module('TimeTracker.members')
        .directive('memberFullname', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'view/components/members/member.fullname.html',
            scope: {

            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
          ctrl.memberId = attr.memberId;
          ctrl.getFullName();
        }
    }

    Controller.$inject = ['MembersService'];

    /* @ngInject */
    function Controller(MembersService) {
        var vm = this;
        vm.memberId = null;

        vm.getFullName = function(){
          return MembersService.getOne(vm.memberId).then(
            function(resolve){
              var member = resolve.member;
              vm.memberFullname = member.first + ' ' + member.last;
            },
            function(reject){
              console.log( 'memberFullname.reject');
              console.log( reject);
            }
          );
        };
    }
})();
