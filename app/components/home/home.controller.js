(function() {
    'use strict';

    angular
        .module('TimeTracker.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location'];

    /* @ngInject */
    function HomeController($location) {
        var vm = this;
        var domain = $location.protocol() + '://' + $location.host();
        vm.currentAPK = domain + '/release/android/timetracker-0.4.apk';
        vm.currentIPA = domain + '/release/ios/timetracker-0.4.ipa';
    }
})();
