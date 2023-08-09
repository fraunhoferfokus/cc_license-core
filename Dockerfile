FROM node:20

COPY . /usr/src/app

# Setting permissions for /usr/src/app
RUN chgrp -R 0 /usr/src/app && \
    chmod -R g=u /usr/src/app 

WORKDIR /usr/src/app

RUN npm i

# Adjust permissions again, especially for the npm cache directory
RUN chgrp -R 0 /.npm && \
    chmod -R g=u /.npm

CMD [ "npm", "start" ]