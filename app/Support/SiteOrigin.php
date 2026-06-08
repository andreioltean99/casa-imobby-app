<?php

namespace App\Support;

class SiteOrigin
{
    public const CANONICAL = 'https://agentia-casa-imobby.ro';

    /**
     * Absolute origin for public SEO URLs (sitemap, canonical, JSON-LD, Inertia appUrl).
     */
    public static function resolve(): string
    {
        if (app()->environment('production')) {
            return self::canonicalUrl();
        }

        $configured = rtrim((string) config('app.url', ''), '/');

        return $configured !== '' ? $configured : self::canonicalUrl();
    }

    public static function canonicalUrl(): string
    {
        $url = rtrim((string) config('app.canonical_url', self::CANONICAL), '/');

        return $url !== '' ? $url : self::CANONICAL;
    }
}
