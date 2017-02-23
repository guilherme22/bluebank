'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './account.routes';
import login from './login';
import transactions from './transactions';


export default angular.module('bluebankApp.account', [uiRouter, login, transactions])
  .config(routing)
  .run(function($rootScope) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if(next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
