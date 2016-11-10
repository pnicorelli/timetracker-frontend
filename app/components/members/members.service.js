(function() {
  'use strict';

  angular
  .module('TimeTracker.members')
  .service('MembersService', Service);

  Service.$inject = ['API', '$localStorage', '$q', '$http'];

  /* @ngInject */
  function Service(API, $localStorage, $q, $http) {
    return {
      getAll: getAll,
      add: add,
      getOne: getOne,
      updateOne: updateOne,
      createPasswordCode: createPasswordCode,
      remove: remove

    };

    function getAll( page, perPage ){
      page = (page)?page:0;
      perPage = (perPage)?perPage:20;
      var query = '?page='+page+'&perPage='+perPage;
      return $http.get(API.url + '/v1/accounts/members'+query).then( function(resp){
        return resp.data;
      });
    }

    function add(member){
      return $http.post(API.url + '/v1/accounts/members', {member: member}).then( function(resp){
        return resp.data;
      });
    }

    function getOne(member){
      return $http.get(API.url + '/v1/accounts/members/'+member).then( function(resp){
        return resp.data;
      });
    }

    function updateOne(member){
      return $http.put(API.url + '/v1/accounts/members/'+member._id, { member: member}).then( function(resp){
        return resp.data;
      });
    }

    function remove(member){
      return $http.delete(API.url + '/v1/accounts/members/'+member).then( function(resp){
        return resp.data;
      });
    }


    function createPasswordCode(member){
      return $http.post(API.url + '/v1/accounts/members/'+member._id+'/code').then( function(resp){
        return resp.data;
      });
    }
  }
})();
