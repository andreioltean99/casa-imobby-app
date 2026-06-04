<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\LegalPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalPageDashboardController extends Controller
{
    public function editTerms()
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

        return Inertia::render('dashboard/legal-terms', [
            'page' => $page,
        ]);
    }

    public function updateTerms(Request $request)
    {
        $locale = app()->getLocale();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $page = LegalPage::firstOrCreate(
            ['type' => 'terms', 'locale' => $locale],
            [
                'title' => 'Terms & Conditions – agentia-casa-imobby.ro',
                'body' => '',
            ]
        );

        $page->update($data);

        return redirect()
            ->route('dashboard.legal.terms.edit')
            ->with('status', 'Terms and conditions updated.');
    }

    public function editPrivacy()
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

        return Inertia::render('dashboard/legal-privacy', [
            'page' => $page,
        ]);
    }

    public function updatePrivacy(Request $request)
    {
        $locale = app()->getLocale();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $page = LegalPage::firstOrCreate(
            ['type' => 'privacy', 'locale' => $locale],
            [
                'title' => 'Privacy Policy – agentia-casa-imobby.ro',
                'body' => '',
            ]
        );

        $page->update($data);

        return redirect()
            ->route('dashboard.legal.privacy.edit')
            ->with('status', 'Privacy policy updated.');
    }
}
