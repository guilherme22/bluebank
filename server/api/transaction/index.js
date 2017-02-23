'use strict';

import {Router} from 'express';
import * as controller from './transaction.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(), controller.index);

router.get('/:account', auth.isAuthenticated(), controller.show)

router.post('/', auth.isAuthenticated(), controller.create);


module.exports = router;
