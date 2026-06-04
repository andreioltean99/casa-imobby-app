<?php

namespace App\Support;

class SiteOrigin
{
    public const CANONICAL = 'https://agentia-casa-imobby.ro';

    public static function resolve(): string
    {
        $configured = rtrim((string) config('app.url', ''), '/');

        if ($configured === '') {
            return self::CANONICAL;
        }

        if (app()->environment('production') && self::isLocalOrigin($configured)) {
            return self::CANONICAL;
        }

        return $configured;
    }

    public static function isLocalOrigin(string $url): bool
    {
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));

        if ($host === '') {
            return true;
        }

        return in_array($host, ['localhost', '127.0.0.1', '[::1]'], true)
            || str_ends_with($host, '.test')
            || str_ends_with($host, '.local');
    }
}
