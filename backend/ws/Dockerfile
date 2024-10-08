FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p  /usr/share/nginx/html/media/
RUN chown www-data:www-data /usr/share/nginx/html/media
# RUN chmod 755 /usr/share/nginx/html/media/
# RUN chown nginx:nginx /usr/share/nginx/html/media/

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
