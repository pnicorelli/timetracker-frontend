(function() {
  'use strict';

  angular
  .module('TimeTracker.report')
  .service('ReportService', ReportService);

  ReportService.$inject = ['API', '$http', 'MembersService'];

  /* @ngInject */
  function ReportService(API, $http, MembersService) {
    return {
      getAll: getAll,
      getAllFullData: getAllFullData
    };

    function buildQuery(page, perPage, memberId, status, dateFrom, dateTo){
      var query = '?page='+page+'&perPage='+perPage;
      if( memberId ){
        query += '&memberId='+memberId;
      }
      if( status ){
        query += '&status='+status;
      }
      if( dateFrom ){
        query += '&from='+dateFrom;
      }
      if( dateTo ){
        query += '&to='+dateTo;
      }
      return query;
    }

    function getAll(page, perPage, memberId, status, dateFrom, dateTo){
      var query = buildQuery(page, perPage, memberId, status, dateFrom, dateTo);
      return $http.get(API.url + '/v1/accounts/timesheet'+query).then( function(resp){
        return resp.data;
      });
    }

    function getAllFullData(page, perPage, memberId, status, dateFrom, dateTo){
      var query = buildQuery(page, perPage, memberId, status, dateFrom, dateTo);
      query += '&withMembers=true';
      return $http.get(API.url + '/v1/accounts/timesheet'+query).then( function(resp){
        return resp.data;
      });
    }
  }
})();
