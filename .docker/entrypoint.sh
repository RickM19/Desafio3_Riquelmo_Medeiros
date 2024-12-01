#!/bin/bash


npm install

npx sequelize db:create
npx sequelize db:migrate
npx sequelize-cli db:seed:all

pm2-runtime start build/shared/http/server.js --name compassApi --watch -i 0

