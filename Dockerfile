FROM node:14.19.1

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm ci

CMD [ "npm", "start" ]
