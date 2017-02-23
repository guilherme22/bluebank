/**
 * Rotas das aplicação
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Inserir as rotas abaixo de acordo com cada dominio
  app.use('/api/transactions', require('./api/transaction'));
  app.use('/api/accounts', require('./api/account'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  //Todos assets indefinidos ou rotas de api que nao existirem, devem retornar um 404 pro usuario
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  //Todas as outras rotas devem redirecionar para index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
