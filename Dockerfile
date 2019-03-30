FROM scardon/ruby-node-alpine:2.6.1
RUN apk update && apk upgrade
RUN apk add alpine-sdk
RUN apk add chromium

WORKDIR '/jekpack'
ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn link
RUN jekpack bundle