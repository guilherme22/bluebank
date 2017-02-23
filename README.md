# bluebank

## Inicio

### Pré Requisitos

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [SQLite](https://www.sqlite.org/quickstart.html)

### Desenvolvimento local

1. Execute `npm install` para instalar todas as dependencias do backend

2. Execute  `gulp serve` para iniciar um servidor local. Ele vai abrir automaticamente um browser pra viocê

## Build

Execute `gulp build` para buildar  e `gulp serve:dist` para um preview ( vai executar na porta 8080 )

### Mocks Criados
1. Guilherme Andrade -
	Email: "guilhermeandradedesouza@gmail.com"
	Senha: 123456
	Agencia: 100
	Conta: 1001

2. Carlos Souza
	Email: "carlos@gmail.com"
	Senha: 123456
	Agencia: 100
	Conta: 2001

##Regras para teste
1. Usuário só consegue transferir para usuário da mesma agência
2. Caso valor seja maior do que ele tem, não transfere.

##Url aplicação em produção
-[http://bluebank-guilherme.herokuapp.com](http://bluebank-guilherme.herokuapp.com)

