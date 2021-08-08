FROM node:14-alpine

WORKDIR /app

COPY build /app/build
COPY *.json /app/
 
RUN npm ci --production
RUN npm i ts-node

CMD [ "npm", "start" ]
