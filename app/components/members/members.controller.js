(function() {
  'use strict';

  angular
  .module('TimeTracker.members')
  .controller('MembersController', Controller);

  Controller.$inject = ['$routeParams', '$location', 'MembersService', 'NotifyService', 'ReportService'];

  /* @ngInject */
  function Controller($routeParams, $location, MembersService, NotifyService, ReportService) {
    var vm = this;
    vm.tabledata = [];
    vm.hasPasswordCode = false;

    vm.showBlockPassword = false;

    vm.getAll = function( tableState ){
      vm.isLoading = true;

      var pagination = tableState.pagination;
      var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
      var perPage = pagination.number || 5;  // Number of entries showed per page.
      var page = Math.round( start / perPage ) + 1;

      MembersService.getAll( page, perPage ).then(
        function(res){
          vm.tabledata = res.data;
          tableState.pagination.numberOfPages = Math.round(res.total / res.perPage)+1;//set the number of pages so the pagination can update
          vm.isLoading = false;
        },
        function(err){
          NotifyService.flash('Errore di connessione');
        });
      };

      vm.create = function(data){
        var newMember = {
          email: vm.email || '',
          first: vm.first || '',
          last: vm.last || ''
        };
        MembersService.add(newMember).then(
          function(res){
            NotifyService.flash('Membro creato');
            $location.path('/members/'+res.member._id);
          },
          function(err){
            NotifyService.flash('Errore nella creazione', 'error');
          }
        );
      };

      vm.loadMember = function(){
        vm.member = {};
        vm.member.memberId = $routeParams.memberId;
        vm.ReportTabledata = [];
        vm.ReportIsLoading = true;
        vm.ReportTotalHours = 0;
        MembersService.getOne(vm.member.memberId).then(
          function(res){
            vm.member = res.member;

            ReportService.getAll(1, 5, vm.member._id, null, null, null).then(
              function(res){
                vm.ReportTabledata = res.data;
                vm.ReportIsLoading = false;
                vm.ReportTotalHours = res.data.reduce( function(prev, curr){
                  if( isNaN(curr.duration) ){
                    return prev;
                  } else {
                    return prev + curr.duration;
                  }
                }, 0);
              },
              function(err){
                NotifyService.flash('Errore di connessione');
                vm.ReportIsLoading = false;
              });
          },
          function(err){
            NotifyService.flash(err.toString(), 'error');
          }
        );
      };

      vm.viewDetail = function(memberId){
        $location.path('/members/'+memberId);
      };

      vm.update = function(){
        MembersService.updateOne(vm.member).then(
          function(res){
            NotifyService.flash('aggiornato');
          },
          function(err){
            NotifyService.flash(err.toString(), 'error');
          }
        );
      };

      vm.remove = function(row){
        MembersService.remove(row._id).then(
          function(res){
            NotifyService.flash('Membro eliminato');
            var index = vm.tabledata.indexOf(row);
            if (index !== -1) {
                vm.tabledata.splice(index, 1);
            }
          },
          function(err){
            NotifyService.flash('Errore nella eliminazione', 'error');
          }
        );
      };

      vm.createPasswordCode = function(){
        MembersService.createPasswordCode(vm.member).then(
          function(res){
            vm.hasPasswordCode = true;
            vm.passwordCode = res.code;
            var t = new Date();
            t.setSeconds(t.getSeconds() + parseInt(res.last));
            vm.passwordCodeLast = t.getHours()+':'+t.getMinutes();
          },
          function(err){
            vm.hasPasswordCode = false;
            NotifyService.flash('Errore nella creazione del codice', 'error');
          }
        );
      };
    }
  })();
