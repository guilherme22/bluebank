'use strict';

import angular from 'angular';
import TransactionsController from './transactions.controller';

export default angular.module('bluebankApp.transactions', [])
  .controller('TransactionsController', TransactionsController)
  .name;
