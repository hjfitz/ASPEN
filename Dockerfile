FROM node:11

# COPY ./db /docker-entrypoint-initdb.d/
WORKDIR /usr/src/app
COPY ./db/10-init.sh /docker-entrypoint-initdb.d/10-init.sh

# move deps and lockfile
COPY package.json ./
COPY yarn.lock ./

COPY ./ ./



# setup program
RUN yarn
RUN yarn build:dev

# move app source


EXPOSE 5000
CMD ["yarn", "start"]
