FROM docker.io/library/node:16 AS build

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn install && yarn build

FROM docker.io/library/nginx:stable
RUN chmod -R g+rwx /var/cache/nginx /var/run /var/log/nginx
# RUN chmod 777 /var/run/nginx.pid
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
