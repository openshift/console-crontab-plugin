# FROM docker.io/library/node:16 AS build

# ADD . /usr/src/app
# RUN ls -la /usr/src/app
# WORKDIR /usr/src/app
# RUN yarn install && yarn build

# FROM docker.io/library/nginx:stable

# LABEL io.k8s.display-name="OpenShift CronTab Plugin" \
#       io.k8s.description="OpenShift Console dynamic plugin used for Crontab CRD." \
#       io.openshift.tags="openshift" \
#       maintainer="Jakub Hadvig <jhadvig@redhat.com>"

# RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html




# FROM registry.access.redhat.com/ubi8/nodejs-16 AS builder
# USER root
# RUN command -v yarn || npm i -g yarn

# COPY . /opt/app-root/src
# WORKDIR /opt/app-root/src
# RUN yarn install --frozen-lockfile --ignore-engines && yarn build

# FROM registry.access.redhat.com/ubi8/nginx-120

# COPY --from=builder /opt/app-root/src/dist /usr/share/nginx/html
# USER 1001
# CMD /usr/libexec/s2i/run



# FROM docker.io/library/node:16 AS build

# ADD . /usr/src/app
# WORKDIR /usr/src/app
# RUN yarn install && yarn build

# FROM docker.io/library/nginx:stable

# LABEL io.k8s.display-name="OpenShift CronTab Plugin" \
#       io.k8s.description="OpenShift Console dynamic plugin used for Crontab CRD." \
#       io.openshift.tags="openshift" \
#       maintainer="Jakub Hadvig <jhadvig@redhat.com>"

# RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html

FROM registry.access.redhat.com/ubi8/nodejs-16 AS builder
USER root
RUN command -v yarn || npm i -g yarn

COPY . /opt/app-root/src
WORKDIR /opt/app-root/src
RUN yarn install --frozen-lockfile --ignore-engines && yarn build

FROM registry.access.redhat.com/ubi8/nginx-120

COPY default.conf "${NGINX_CONFIGURATION_PATH}"
COPY --from=builder /opt/app-root/src/dist .
USER 1001
CMD /usr/libexec/s2i/run
