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
                'title' => 'Terms & Conditions – casa-imobby.ro',
                'body' => '',
            ],
            'ro' => [
                'title' => 'Termeni și Condiții de Utilizare – casa-imobby.ro',
                'body' => '',
            ],
        ];

        $defaults = $defaultsByLocale[$locale] ?? $defaultsByLocale['en'];

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
                'title' => 'Privacy Policy – casa-imobby.ro',
                'body' => '',
            ],
            'ro' => [
                'title' => 'Politica de confidențialitate – casa-imobby.ro',
                'body' => '',
            ],
        ];

        $defaults = $defaultsByLocale[$locale] ?? $defaultsByLocale['en'];

        $page = LegalPage::firstOrCreate(
            ['type' => 'privacy', 'locale' => $locale],
            $defaults
        );

        return Inertia::render('public/privacy', [
            'page' => $page,
        ]);
    }
}
