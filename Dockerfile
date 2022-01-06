FROM node:alpine
WORKDIR '/app'
COPY package.json ./
COPY yarn.lock ./
RUN yarn config set strict-ssl false && yarn install
COPY . . 
RUN yarn config set strict-ssl false && yarn build

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html