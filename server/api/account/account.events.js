/**
 * Account model events
 */

'use strict';

import {EventEmitter} from 'events';
var Account = require('../../sqldb').Account;
var AccountEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AccountEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Account) {
  for(var e in events) {
    let event = events[e];
    Account.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    AccountEvents.emit(event + ':' + doc._id, doc);
    AccountEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Account);
export default AccountEvents;
