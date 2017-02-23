/**
 * Eventos da entidade de Transações
 */

'use strict';

import {EventEmitter} from 'events';
var Transaction = require('../../sqldb').Transaction;
var TransactionEvents = new EventEmitter();

// maximo de ouvintes (0 == unlimited)
TransactionEvents.setMaxListeners(0);

// Eventos da minha entidade
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Registrando um evento para emitter pros eventos ( caso queira usar socket.io )
function registerEvents(Transaction) {
  for(var e in events) {
    let event = events[e];
    Transaction.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    TransactionEvents.emit(event + ':' + doc._id, doc);
    TransactionEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Transaction);
export default TransactionEvents;
