# Single image for dev and prod: PHP-FPM (Nginx talks to this via FastCGI)
FROM php:8.4-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    gnupg \
    sqlite3 \
    libsqlite3-dev \
    libzip-dev \
    libmariadb-dev-compat \
    libmariadb-dev \
    default-mysql-client \
    procps \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql pcntl gd \
    && rm -rf /var/lib/apt/lists/*

# PHP upload limits (must match config/uploads.php and nginx client_max_body_size)
RUN printf "%s\n" \
    "file_uploads=On" \
    "upload_max_filesize=1024M" \
    "post_max_size=1024M" \
    "memory_limit=2048M" \
    "max_execution_time=3600" \
    "max_input_time=3600" \
    > /usr/local/etc/php/conf.d/99-uploads.ini

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node.js and npm (for Vite dev server and frontend builds)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Default: run PHP-FPM (overridden by compose command for dev/prod startup)
CMD ["php-fpm"]
