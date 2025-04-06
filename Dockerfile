FROM node:23-alpine

RUN apk add --no-cache \
    poppler-utils \
    graphicsmagick \
    ghostscript \
    make \
    g++

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN mkdir -p /app/uploads /app/converted
EXPOSE 3000
CMD ["npm", "start"]