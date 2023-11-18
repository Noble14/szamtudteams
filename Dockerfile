FROM node:18

workdir /app

RUN npm install

COPY . . 

ENV PORT=8080

EXPOSE 8080

cmd ["npm", "start"]
