FROM serversideup/php:8.3-fpm-nginx

ENV PHP_OPCACHE_ENABLE=1

USER root

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g bun

RUN install-php-extensions bcmath

COPY --chown=www-data:www-data . /var/www/html

USER www-data

RUN composer install --no-interaction --optimize-autoloader --no-dev

RUN bun install --frozen-lockfile
RUN bun run build
