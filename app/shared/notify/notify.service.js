(function() {
    'use strict';

    angular
        .module('TimeTracker.notify')
        .service('NotifyService', Service);

    Service.$inject = ['notifier'];

    /* @ngInject */
    function Service(notifier) {
        return {
          flash: flash
        }

        function flash(message, type){
          type = (type)?type:'info';
          notifier.notify({
                  template: message,
                  hasDelay: true,
                  delay: 3000,
                  type: type,
                  position: 'top center'
              });
        }

    }
})();
