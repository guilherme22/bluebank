'use strict';

import {User, Account} from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.findAll({
    attributes:[
    '_id',
    'email',
    'cpf',
    'role',
    'provider'
    ],
    include:[
    {model:Account, as: "account"}
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Criando um novo usuario
 */
export function create(req, res) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  return newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Retornando um usuario por id
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.find({
    where: {
      _id: userId
    },
    attributes:[
    '_id',
    'name',
    'email',
    'cpf',
    'role',
    'provider',
    ],
    include:[
    {model:Account, as: "account"}
    ]
  })
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletando um usuario
 * Restrição: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Atualizar senha do usuario
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.find({
    where: {
      _id: userId
    }
  }).then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Retornando minhas informações pro client
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'cpf',
      'role',
      'provider'
    ],
    include:[
    {model:Account, as: "account"}
    ]

  })
    .then(user => {
      if(!user) {
        return res.status(401).end();
      }
      res.json(user)

    })
    .catch(err => next(err));
}

/**
 * Callback de authenticação
 */
export function authCallback(req, res) {
  res.redirect('/');
}
