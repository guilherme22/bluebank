/**
 * Inicialização do modulo do Sequelize
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

db.Transaction = db.sequelize.import('../api/transaction/transaction.model');
db.Account = db.sequelize.import('../api/account/account.model');
db.User = db.sequelize.import('../api/user/user.model');

//conta possui um usuario
db.User.belongsTo(db.Account, {as: "account"})

module.exports = db;
