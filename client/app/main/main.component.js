import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {


  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.currentUser = Auth.getCurrentUserSync;
    this.transaction = {
        fromAccount: 0,
        fromAgency: 0,
        value: 0,
        toAccount: 0,
        toAgency: 0
    };
  }

  makeTransaction() {
    this.transaction.fromAccount = this.currentUser().account.accountNumber;
    this.transaction.fromAgency = this.currentUser().account.agencyNumber;
    console.log(this.transaction)
    if(this.transaction.value > this.currentUser().account.saldo){
      return alert("Você não possui saldo suficiente");
    }

    if(this.transaction.toAgency != this.currentUser().account.agencyNumber){
      return alert("No momento, apenas fazemos transferencia entre agencias.")
    }

    this.$http.post('/api/transactions', this.transaction).then((response)=>{
          console.log(response);
          location.reload()
          alert("transferencia realizada com sucesso.")
        
    })  
  }

}

export default angular.module('bluebankApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
