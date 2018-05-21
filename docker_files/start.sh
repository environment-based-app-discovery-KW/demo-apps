#!/bin/bash
find /var/lib/mysql -type f -exec touch {} \; && service mysql start

source /etc/apache2/envvars
exec apache2 -D FOREGROUND
