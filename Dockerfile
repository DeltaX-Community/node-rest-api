FROM node:14-alpine

COPY . . 
 
RUN npm ci --production
RUN npm i -g ts-node typescript
RUN npm run build

CMD [ "npm", "start" ]
