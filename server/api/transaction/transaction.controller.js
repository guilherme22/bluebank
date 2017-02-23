/**
 * Documentação das apis.
 * GET     /api/transactions              ->  index
 * POST    /api/transactions              ->  create
 * GET     /api/transactions/:id          ->  show
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Transaction, Account,User, sequelize} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function transfer(transaction, req, res){

    return sequelize.transaction((t)=> {
      var from = {}
      return Account.find({
      where:{
        accountNumber: transaction.fromAccount,
        agencyNumber: transaction.fromAgency
      }
    }, {transaction: t})
    .then((fromAccount)=>{
      //caso seja o cliente tentando fazer transferencia pra ele mesmo, deve cancelar a transação.
        from = fromAccount
        if(fromAccount.accountNumber == transaction.toAccount){
          throw new Error("Não é possível transferir para si mesmo.")
        }
        //caso o usuario não tenha saldo, deve cancelar a transação
        if(fromAccount.saldo >= transaction.value){
            fromAccount.set("saldo", fromAccount.get("saldo") - transaction.value)
             return fromAccount.save({transaction: t});
        }
       throw new Error("Sem fundos suficientes");
    })
    .then(()=>{
      /*se o usuario tiver saldo, e fazer uma transação para um usuario da mesma agencia, 
      então cria um historico de transação pro usuario de debito em sua conta*/
        return Transaction.create({
            account: transaction.fromAccount,
            agency: transaction.fromAgency,
            value: transaction.value,
            operation:"debit"
        },{transaction: t})
    })
    .then(()=>{
      //retorna uma conta de destino da transação
      return Account.find({
        where:{
          accountNumber: transaction.toAccount,
          agencyNumber: transaction.toAgency
        }
      },{transaction: t})
    }).then((toAccount)=>{
      //se o usuario de destino for a mesma agencia do usuario de origem, então libera pra creditar na conta
      //senão, cancela a operação, e da um rollback nas transações de debito anterior.
        if(from.agencyNumber == toAccount.agencyNumber){
            toAccount.set('saldo', toAccount.get('saldo') + transaction.value)
            return toAccount.save({transaction: t})
        }
        throw new Error("Não é possível transferir para uma agência diferente.")
    })
    .then(()=>{
      /*se é da mesma agencia e é um usuario valido, então credita o valor na conta de destino 
      e gera uma transação de debito pro usuario de destino*/
      
        return Transaction.create({
          account: transaction.toAccount,
          agency: transaction.toAgency,
          value: transaction.value,
          operation:"credit"
        },{transaction: t})
    })
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
   
    
}



// Busca todas a transações
export function index(req, res) {
  return Transaction.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Busca uma transação por id
export function show(req, res) {
  return Transaction.findAll({
    where: {
      account: req.params.account
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Cria uma nova transação
export function create(req, res) {

  return transfer(req.body, req, res)
}


