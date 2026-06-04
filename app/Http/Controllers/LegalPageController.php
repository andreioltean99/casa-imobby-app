<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use Inertia\Inertia;

class LegalPageController extends Controller
{
    public function terms()
    {
        $locale = app()->getLocale();

        $defaultsByLocale = [
            'en' => [
                'title' => 'Terms & Conditions – agentia-casa-imobby.ro',
                'body' => '',
            ],
            'ro' => [
                'title' => 'Termeni și Condiții de Utilizare – agentia-casa-imobby.ro',
                'body' => '',
            ],
        ];

        $fallback = config('app.fallback_locale', 'ro');
        $defaults = $defaultsByLocale[$locale] ?? $defaultsByLocale[$fallback] ?? $defaultsByLocale['ro'];

        $page = LegalPage::firstOrCreate(
            ['type' => 'terms', 'locale' => $locale],
            $defaults
        );

        return Inertia::render('public/terms', [
            'page' => $page,
        ]);
    }

    public function privacy()
    {
        $locale = app()->getLocale();

        $defaultsByLocale = [
            'en' => [
                'title' => 'Privacy Policy – agentia-casa-imobby.ro',
                'body' => '',
            ],
            'ro' => [
                'title' => 'Politica de confidențialitate – agentia-casa-imobby.ro',
                'body' => '',
            ],
        ];

        $fallback = config('app.fallback_locale', 'ro');
        $defaults = $defaultsByLocale[$locale] ?? $defaultsByLocale[$fallback] ?? $defaultsByLocale['ro'];

        $page = LegalPage::firstOrCreate(
            ['type' => 'privacy', 'locale' => $locale],
            $defaults
        );

        return Inertia::render('public/privacy', [
            'page' => $page,
        ]);
    }
}
