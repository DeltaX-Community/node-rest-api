FROM alpine:3.10

WORKDIR /src

COPY *.json ./

# RUN npm install
# RUN npm i ts-node typescript

COPY . .

CMD ["npm", "start"]
