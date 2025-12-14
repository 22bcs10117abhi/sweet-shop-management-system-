FROM node:18-alpine

WORKDIR /server

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src src

EXPOSE 80

CMD ["npm", "start"]