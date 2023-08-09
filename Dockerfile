FROM node:20


COPY . /usr/src/app

RUN chgrp -R 0 /usr/src/app && \
    chmod -R g=u /usr/src/app 

WORKDIR /usr/src/app

RUN npm i

CMD [ "npm", "start" ]
