(function() {
    'use strict';

    angular
        .module('TimeTracker.report')
        .filter('secondsToHours', filterSecondsToHours)
        .filter('timesheetStatus', timesheetStatus);

    function filterSecondsToHours() {
        return filterFilter;

        function filterFilter(params) {
          if( params < 0){
            return '00:00:00';
          }
          var sec_num = parseInt(params, 10);
          var hours   = Math.floor(sec_num / 3600);
          var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
          var seconds = sec_num - (hours * 3600) - (minutes * 60);

          if (hours   < 10) {
            hours = '0'+hours;
          }
          if (minutes < 10){
            minutes = '0'+minutes;
          }
          if (seconds < 10){
            seconds = '0'+seconds;
          }
          return hours+':'+minutes+':'+seconds;
        }
    }

    function timesheetStatus() {
        return filterFilter;

        function filterFilter(params) {
          switch(params){
            case 'started':
              params = 'iniziato';
              break;
            case 'closed':
              params = 'terminato';
              break;
            case 'afterwards':
              params = 'inserito';
              break;
            default:
          }
          return params;
        }
    }
})();
