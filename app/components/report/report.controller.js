(function() {
  'use strict';

  angular
  .module('TimeTracker.report')
  .controller('ReportController', ReportController);

  ReportController.$inject = ['ReportService', 'NotifyService', '$routeParams', '$filter'];

  /* @ngInject */
  function ReportController(ReportService, NotifyService, $routeParams, $filter) {
    var vm = this;
    vm.totalRecord = 0;

    vm.searchClean = function( ){
      var date = new Date();
      switch( $routeParams.when ){
        case 'prevMonth':
        vm.searchFrom = new Date(date.getFullYear(), date.getMonth()-1, 1);
        vm.searchTo = new Date(date.getFullYear(), date.getMonth(), 0);
        vm.searchStatus = '';
        break;
        case 'currentJobs':
        vm.searchFrom = new Date( date.getFullYear(), date.getMonth(), 1 );
        vm.searchTo = new Date();
        vm.searchStatus = 'started';
        break;
        default:
        vm.searchFrom = new Date(date.getFullYear(), date.getMonth(), 1);
        vm.searchTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        vm.searchStatus = '';
      }
    };

    vm.search = function(tableState){

      vm.tableState = (tableState)?tableState:vm.tableState;
      var memberId = null;
      var status = vm.searchStatus;
      if( status === ''){
        status = null;
      }
      var dateFrom = new Date(vm.searchFrom).toISOString();
      var dateTo = new Date(vm.searchTo).toISOString();

      vm.isLoading = true;

      var pagination = vm.tableState.pagination;
      var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var perPage = pagination.number || 10;  // Number of entries showed per page.
      var page = Math.round( start / perPage ) + 1;

      ReportService.getAll( page, perPage, memberId, status, dateFrom, dateTo ).then(
        function(res){
          vm.totalRecord = res.total;
          vm.tabledata = res.data;
          vm.tableState.pagination.numberOfPages = Math.round(res.total / res.perPage)+1;//set the number of pages so the pagination can update
          vm.isLoading = false;
        },
        function(err){
          NotifyService.flash('Errore di connessione');
        });
      };

      vm.searchClean();

      vm.exportData = function(){
        vm.exportFields = ['riga', 'nome', 'cognome', 'email', 'stato', 'inizio', 'fine', 'durata'];
        var memberId = null;
        var status = vm.searchStatus;
        if( status === ''){
          status = null;
        }
        var dateFrom = new Date(vm.searchFrom).toISOString();
        var dateTo = new Date(vm.searchTo).toISOString();
        return ReportService.getAllFullData( 1, vm.totalRecord, memberId, status, dateFrom, dateTo ).then(
          function(resolve){
            var exported = [];
            for(var row=0; row< vm.totalRecord; row++){
              var dataMap = {};
              dataMap['row'] = row+1;
              dataMap['first'] = resolve.data[row].memberId.first;
              dataMap['last'] = resolve.data[row].memberId.last;
              dataMap['email'] = resolve.data[row].memberId.email;
              dataMap['stato'] = $filter('timesheetStatus')(resolve.data[row].status);
              dataMap['from'] = $filter('date')(resolve.data[row].from, 'dd/MM/yyyy HH:mm:ss');
              dataMap['to'] = $filter('date')(resolve.data[row].to, 'dd/MM/yyyy HH:mm:ss');
              dataMap['duration'] = $filter('secondsToHours')(resolve.data[row].duration);
              exported.push(dataMap);
            }
            return exported;
          }
        );
      };
    }
  })();
