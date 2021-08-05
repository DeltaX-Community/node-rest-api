FROM node:14-alpine

WORKDIR /app

COPY . /app
 
RUN npm ci --production
RUN npm i ts-node
# RUN npm run build

CMD [ "npm", "start" ]
