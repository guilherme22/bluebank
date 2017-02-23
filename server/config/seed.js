/**
 * Mock para popular os usuarios, contas da aplicação
 */

'use strict';
import sqldb from '../sqldb';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) { 
    let Account = sqldb.Account;
    let User = sqldb.User;

    return Account.sync({force:true})
    .then(()=>User.sync({force:true}))
    .then(()=>{
        return Account.create({
            accountNumber: 1001,
            agencyNumber: 100,
            saldo: 1200
        })
    })
    .then((account)=>{
            return User.create({
            provider: 'local',
            role: 'user',
            cpf: 40043295827,
            name: 'Guilherme Andrade',
            email: 'guilhermeandradedesouza@gmail.com',
            password: '123456'
          }).then((usuario)=>{
                return usuario.setAccount(account)

          })
    })
    .then(()=>{
        return Account.create({
            accountNumber: 2001,
            agencyNumber: 100,
            saldo: 800
        })
    })
    .then((account)=>{
            return User.create({
            provider: 'local',
            role: 'user',
            cpf: 40043295828,
            name: 'CarlosSouza',
            email: 'carlos@gmail.com',
            password: '123456'
          }).then((usuario)=>{
                return usuario.setAccount(account)

          })
    })
    .then((usuario)=> console.log("mock criado com sucesso.", JSON.stringify(usuario)))

  }
}
