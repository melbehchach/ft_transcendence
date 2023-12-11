FROM node:20

RUN apt-get update && apt-get upgrade -y 

WORKDIR /app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install -g npm@latest

RUN npm ci

CMD ["npm", "run", "start:dev"]
