FROM scardon/ruby-node-alpine:2.6.1
RUN apk update && apk upgrade
RUN apk add alpine-sdk

WORKDIR '/jekpack'

COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn link
RUN jekpack bundle