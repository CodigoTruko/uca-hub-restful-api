FROM node:20.3.1-alpine

WORKDIR /uca-hub-api

COPY package*.json ./

RUN npm install --force

COPY . .

ENV API_PORT=3000:3000
 
CMD ["npm", "run", "start"]