FROM node:11

# COPY ./db /docker-entrypoint-initdb.d/
WORKDIR /usr/src/app

# move deps and lockfile
# COPY package.json ./
# COPY yarn.lock ./

COPY ./ ./



# setup program
RUN yarn
RUN yarn build:dev

# move app source


EXPOSE 5000
# CMD ["yarn", "start"]
