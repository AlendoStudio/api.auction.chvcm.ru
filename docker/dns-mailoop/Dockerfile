FROM node:8-stretch

COPY . /dns-mailoop

RUN cd /dns-mailoop && \
    yarn install && \
    yarn cache clean

WORKDIR /dns-mailoop

CMD PORT='53' HOST='0.0.0.0' node index.js

EXPOSE 53
