'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Account', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
  
    saldo: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
   accountNumber:{
    type: DataTypes.INTEGER,
    allowNull: false
   },
   agencyNumber:{
    type: DataTypes.INTEGER,
    allowNull:false
   }
  });
}
