# Stage 0, for downloading project’s npm dependencies, building and compiling the app.
# Angular 6 requires node:8.9+
FROM node:16.14.0 as node
USER root
WORKDIR /app
COPY ./ /app
RUN npm install
COPY package.json /app
#RUN npm install -g npm@8.12.1
RUN npm run build --prod
# Stage 1, for copying the compiled app from the previous step and making it ready for production with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/fuse /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN apk update
RUN apk upgrade
RUN apk add bash
RUN apk add openssl
RUN /bin/bash -c "openssl req -x509 -out etc/ssl/localhost.crt -keyout etc/ssl/localhost.key \
      -newkey rsa:2048 -nodes -sha256 \
      -subj '/CN=localhost' -extensions EXT -config <( \
       printf '[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth')"

ENTRYPOINT ["nginx", "-g", "daemon off;"]