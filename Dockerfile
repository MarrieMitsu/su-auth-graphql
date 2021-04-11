FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

RUN yarn

# Bundle app source
COPY . .

COPY .env ./

RUN yarn build

EXPOSE 4000 1025 8025

CMD ["node", "dist/index.js"]