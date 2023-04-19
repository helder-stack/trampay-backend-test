FROM node

COPY . .

WORKDIR .

RUN "yarn"

EXPOSE 3001
