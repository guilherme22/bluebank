'use strict';

export default class SettingsController {

  /*@ngInject*/
  constructor(Auth, $http, $timeout) {
    this.Auth = Auth;
    this.currentUser = Auth.getCurrentUser;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.transactions = [];
    this.$http = $http;
    this.$timeout =$timeout;
  }
  $onInit(){
    this.currentUser().then((user)=>{
      return user;
   }).then((user)=>{
     this.$http.get(`/api/transactions/${user.account.accountNumber}`)
       .then((response)=>{
        return response.data.reverse();
       })
       .then((transactions)=>{
        
          this.transactions = transactions

       })
       .catch((e)=>{
        alert("Erro ao retornar ultimos extratos")
       })
   })
  }

}
