FROM node:14-alpine

WORKDIR /app

COPY build /app/build
COPY *.json /app/
 
RUN npm ci --production
RUN npm i ts-node

ENV NODE_ENV production
ENV PORT 3002
EXPOSE ${PORT}

CMD [ "npm", "run", "seed:start" ]
