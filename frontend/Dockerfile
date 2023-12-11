FROM node:20

WORKDIR /app

COPY ./package.json ./

# COPY ./package-lock.json ./

RUN apt-get update && apt-get upgrade -y

RUN npm install -g npm@latest

RUN npm i -f

CMD ["npm", "run", "dev", "--", "-p", "3001"]
