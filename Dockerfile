FROM node:14-alpine

# WORKDIR /app

COPY build/routes.ts build/ 
COPY build/swagger.json build/ 
COPY src src
COPY *.json ./
 
RUN npm ci --production
RUN npm i ts-node
# RUN npm run build

CMD [ "npm", "start" ]
