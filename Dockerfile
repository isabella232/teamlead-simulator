FROM node:14.15.4-alpine
COPY . /app
WORKDIR /app
EXPOSE 3333
RUN node ci
CMD ["node", "serve"]