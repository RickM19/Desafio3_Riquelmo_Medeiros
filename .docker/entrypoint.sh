#!/bin/bash
npm run build
npx sequelize db:create
npx sequelize db:migrate
npx sequelize-cli db:seed:all
npm start

