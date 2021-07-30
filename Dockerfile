FROM node:14-alpine

WORKDIR /src

COPY *.json ./

RUN npm install
RUN npm i ts-node typescript

COPY . .

CMD ["npm", "start"]
