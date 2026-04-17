<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Public site identity (matches resources/js/components/public/Header.tsx)
    |--------------------------------------------------------------------------
    */

    'site_name' => env('BRAND_SITE_NAME', 'Casa Imobby'),

    'site_tagline' => env('BRAND_SITE_TAGLINE', 'Agenție imobiliară. Case, apartamente și terenuri'),

    /*
    |--------------------------------------------------------------------------
    | Brand colors (Casa Imobby logo: blue #1D5E9B, green #4CA828)
    |--------------------------------------------------------------------------
    | Used for public-facing Blade pages that read brand colors from config.
    */

    /** Primary brand / CTA */
    'accent' => env('BRAND_ACCENT', '#1D5E9B'),

    /** Soft tint for icons, chips, subtle backgrounds */
    'accent_soft' => env('BRAND_ACCENT_SOFT', '#E8F2FA'),

    /** Main body text (~ oklch(0.145 0 0)) */
    'foreground' => env('BRAND_FOREGROUND', '#171717'),

    /** Secondary text */
    'muted_foreground' => env('BRAND_MUTED_FOREGROUND', '#737373'),

    /** Admin notice strip on blog index */
    'admin_notice_bg' => env('BRAND_ADMIN_NOTICE_BG', '#E8F2FA'),

    'admin_notice_text' => env('BRAND_ADMIN_NOTICE_TEXT', '#164574'),

];
