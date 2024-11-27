FROM node:18-alpine

RUN apk add --no-cache bash
RUN npm install -g pm2



WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install --no-cache

COPY . .

CMD ["pm2-runtime", "start", "build/shared/http/server.js", "--name", "compassApi", "--watch", "-i", "0"]
