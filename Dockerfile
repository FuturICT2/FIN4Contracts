FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY contracts ./contracts/
COPY migrations ./migrations/
COPY truffle-config.js ./
COPY verifiers.js ./
COPY config.json ./
COPY compile-and-migrate.sh ./
RUN chmod ugo+rwx compile-and-migrate.sh
RUN npm install --silent

# truffle
RUN npm install -g truffle --silent
