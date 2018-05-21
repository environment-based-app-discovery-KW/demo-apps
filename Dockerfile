FROM phusion/baseimage
ENV DEBIAN_FRONTEND noninteractive

# install php & apache
RUN add-apt-repository -y ppa:ondrej/php
RUN apt update
RUN apt install -y python-software-properties wget git apache2 mysql-server curl pwgen zip unzip
RUN apt install -y php7.1 php7.1-dom php7.1-cli php7.1-common libapache2-mod-php7.1 php7.1-mysql php7.1-fpm php7.1-curl php7.1-gd php7.1-bz2 php7.1-mcrypt php7.1-json php7.1-tidy php7.1-mbstring php-redis

# configure php
RUN update-alternatives --set php /usr/bin/php7.1
RUN phpenmod mcrypt
RUN sed -i "s/;date.timezone =/date.timezone = Asia\/Shanghai/g" /etc/php/7.1/apache2/php.ini
RUN sed -i "s/;date.timezone =/date.timezone = Asia\/Shanghai/g" /etc/php/7.1/cli/php.ini
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer
ENV PHP_UPLOAD_MAX_FILESIZE 100M
ENV PHP_POST_MAX_SIZE 100M
RUN sed -ri -e "s/^upload_max_filesize.*/upload_max_filesize = ${PHP_UPLOAD_MAX_FILESIZE}/" \
    -e "s/^post_max_size.*/post_max_size = ${PHP_POST_MAX_SIZE}/" /etc/php/7.1/apache2/php.ini

# init mysql
WORKDIR /tmp
ADD docker_files/database/init.sql /tmp/init.sql
RUN find /var/lib/mysql -type f -exec touch {} \; && service mysql start && mysql -u root < init.sql

# install code
COPY backend /usr/local/src/demo-apps
COPY docker_files/server/dotenv /usr/local/src/demo-apps/.env
WORKDIR /usr/local/src/demo-apps
RUN composer install
RUN chmod -R 777 storage bootstrap
RUN php artisan key:generate

# configure apache
RUN a2enmod rewrite
WORKDIR /var/www/
RUN ln -s /usr/local/src/demo-apps demo-apps
WORKDIR /var/www/html
RUN ln -s /usr/local/src/demo-apps/public demo-apps
ADD docker_files/apache2/ports.conf /etc/apache2/ports.conf
ADD docker_files/apache2/site.conf /etc/apache2/sites-enabled/000-default.conf

# expose port
EXPOSE 3333

# RUN services
ADD docker_files/start.sh /usr/local/src/start.sh
WORKDIR /usr/local/src
RUN chmod a+x start.sh
CMD ["./start.sh"]

# docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
# docker build -t demo_apps_image .
# docker run -p 0.0.0.0:3333:3333 --name demo_apps_container -t demo_apps_image
# docker exec -it demo_apps_container /bin/bash
