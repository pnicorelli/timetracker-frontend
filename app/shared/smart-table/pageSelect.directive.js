(function() {
    'use strict';

    angular
        .module('TimeTracker')
        .directive('pageSelect', directive);

    /* @ngInject */
    function directive(){
      return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function(scope, element, attrs) {
              scope.$watch('currentPage', function(c) {
                scope.inputPage = c;
              });
            }
          }
    }
})();
