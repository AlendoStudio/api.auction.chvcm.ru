FROM node:10-alpine

ARG RECAPTCHA_SITE

COPY . /alendo-api.auction.chvcm.ru

RUN apk add --no-cache --virtual .gyp python make g++ && \
    cd /alendo-api.auction.chvcm.ru && \
    yarn install --production false && \
    yarn build && \
    yarn install --production true && \
    yarn cache clean && \
    apk del .gyp

WORKDIR /alendo-api.auction.chvcm.ru

ENV PORT 80
ENV HOST 0.0.0.0

CMD ["node", "packages/server/dist/bin/web.js"]

EXPOSE 80
