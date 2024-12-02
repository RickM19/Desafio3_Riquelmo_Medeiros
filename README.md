# 💻 AWS Node - Desafio 03 API - (GRUPO:THE BIG NODE THEORY) - Riquelmo Medeiros

## Descrição

Esse projeto foi desenvolvido durante a trilha de Node.js do programa de bolsas da Compass UOL e tem como objetivo criar uma API simulando um sistema da empresa CompassCar que possui funcionalidades desde o cadastramento de usuários, clientes e carros até a criação e gerenciamento de pedidos

## Como executar o projeto?

-   Utilizando no terminal o comando `git clone` git@github.com:RickM19/Desafio3_Riquelmo_Medeiros.git crie uma cópia desse projeto em seu repositório local
-   Instale as dependências necessárias utilizando o comando `npm install`
-   Inicie o seu Postgres e configure a conexão do sequelize ao seu usuário.
-   Em seu terminal utilize nessa ordem as seguintes linhas de comando:

1. npx sequelize db:create -> crie o banco de dados em sua máquina a partir do arquivo de configuração.
2. npx sequelize db:migrate -> execute as migrações existentes.
3. npx sequelize-cli db:seed:all -> execute as seeds para criar um usuário teste no banco de dados.

-   Execute o projeto utilizando o comando `npm run dev` no terminal.
-   A aplicação estará rodando na porta 3000

## Execute utilizando o compose

-   Com o docker-compose instalado e rodando emm sua máquina digite o comando docker-compose up

## Tecnologias utilizadas

-   Node.js
-   NPM
-   Express
-   Sequelize
-   Postgres
-   Typescript
-   Axios
-   Jswonwebtoken
-   Celebrate
-   Bcryptjs
-   Eslint
-   Docker
-   Docker-compose
-   Jest

## ROTAS

-   Login: `/api/v1/login`
-   Usuários: `/api/v1/users`
-   Clientes: `/api/v1/customers`
-   Carros: `/api/v1/cars`
-   Pedidos: `/api/v1/Order`
