'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Transaction', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    value: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    account: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operation: {
      type:DataTypes.TEXT
    }
  });
}
