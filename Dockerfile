#construimos la imagen del angular
FROM node:lts-alpine3.22 AS build

WORKDIR /usr/src/app

COPY package*.json ./

#install angular cli
RUN npm install -g @angular/cli@19.1.8

#install project dependencies
RUN npm install

COPY . .

RUN npm run build -- --configuration=production --base-href=/plataforma/ --deploy-url=/plataforma/

#paso 2
FROM nginx:alpine3.22

ARG USER="webapp"

#crear grupo y usuario
RUN addgroup --gid 1000 -S $USER && adduser --uid 1000 -S $USER -G $USER

# Eliminar archivos innecesarios por seguridad
RUN rm -rf /etc/apk/* \
    && rm -rf /var/cache/apk/* \
    && rm -rf /root/.npm \
    && rm -rf /tmp/*

# 2 ️Limpiar archivos innecesarios (mantén /tmp al menos vacío)
RUN rm -rf /etc/apk/* /var/cache/apk/* /root/.npm

# 3 ️Crear rutas que Nginx necesita para escritura
RUN mkdir -p /var/cache/nginx /var/run /tmp /run \
    && chown -R $USER:$USER /var/cache/nginx /var/run /tmp /run \
    && chmod 755 /var/cache/nginx /var/run /tmp /run

#eliminar pagina por defecto
RUN rm -rf /usr/share/nginx/html/*

#copiar configuracion de nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copiar la carpeta dist a la carpeta de Nginx
COPY --from=build /usr/src/app/dist/web-app/browser /usr/share/nginx/html

# Cambiar permisos de los archivos estáticos
RUN chown -R $USER:$USER /usr/share/nginx/html

# Usar usuario no root
USER $USER

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
