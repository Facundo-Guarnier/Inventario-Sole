#!/bin/sh

#! Reemplazar el placeholder con la URL real
sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" /usr/share/nginx/html/main*.js

#! Iniciar nginx
nginx -g 'daemon off;'