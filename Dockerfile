FROM node:latest
RUN mkdir /code
WORKDIR /code
COPY . /code
RUN npm install
CMD ["npm","run","start"]
EXPOSE 8080