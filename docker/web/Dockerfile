FROM node:8-stretch

COPY . /alendo-api.auction.chvcm.ru

RUN apt-get install libpq-dev && \
    cd /alendo-api.auction.chvcm.ru && \
    yarn install && \
    yarn cache clean

WORKDIR /alendo-api.auction.chvcm.ru

CMD PORT='80' HOST='0.0.0.0' yarn web

EXPOSE 80
