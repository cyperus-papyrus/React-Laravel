
## 1. Настройка сервера. 
Предположим ОС - Ubuntu.

Обновить ОСь:
```
sudo apt update
sudo apt upgrade
```
Создать нового пользователя с админскими правами. Выключить возможность заходить на сервер из-под root. Настроить вход по SSH для нового юзера. Добавить нового юзера в группу www-data.


## 2. Установить все необходимые пакеты: php, composer, node, nginx, mysql (или любую другую БД).
```
sudo apt install php php-cli php-fpm php-mysql php-xml php-curl php-mbstring php-zip php-gd php-bcmath php-json unzip
sudo apt install nginx

sudo apt install nodejs
sudo apt install npm

curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
Запустить nginx, настроить файероволл на сервере, открыть порты (80 для http, 443 для https, можно проверить 22 для ssh)
```
sudo systemctl start nginx
sudo systemctl enable nginx
sudo ufw allow 80
```


## 3. Развернуть проект из репозитория.

Клонировать из гит (git clone). Зайти в папку backend
```
composer install
```
В файле .env прописать параметры подключения к БД.
Далее:
```
php artisan key:generate
php artisan migrate
```
По желанию натянуть на БД дамп.


## 4. Настроить nginx.
```
sudo vim /etc/nginx/sites-available/project (название я обычно беру в виде доменного имени) 
```
Сам файл настройки:
```
server {
    listen 80;
    server_name project;

    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location / {
        root /var/www/frontend;
        try_files $uri /index.html;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```
Далее
```
sudo ln -s /etc/nginx/sites-available/project /etc/nginx/sites-enabled/
sudo nginx -s reload
```