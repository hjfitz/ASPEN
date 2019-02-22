FROM node:11

WORKDIR /usr/src/app

# move deps and lockfile
COPY package.json ./
COPY yarn.lock ./

COPY ./ ./

# setup program
RUN yarn
# RUN yarn build:prod

# move app source


EXPOSE 5000
CMD ["yarn", "start"]
