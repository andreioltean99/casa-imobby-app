<?php

namespace App\Http\Controllers;

class LocaleController extends Controller
{
    public function switch(string $locale)
    {
        $available = (array) config('app.available_locales', ['ro', 'en']);

        if (! in_array($locale, $available, true)) {
            abort(404);
        }

        $referer = (string) request()->headers->get('referer', '');
        $isAdminContext = request()->query('context') === 'admin'
            || str_contains($referer, '/dashboard');

        // Persist and immediately apply the locale in context-specific storage
        if ($isAdminContext) {
            session(['admin_locale' => $locale]);
            $cookieName = 'admin_locale';
        } else {
            session(['site_locale' => $locale]);
            $cookieName = 'site_locale';
        }

        app()->setLocale($locale);

        return redirect()->back()->cookie(
            $cookieName,
            $locale,
            60 * 24 * 365 // 1 year
        );
    }
}
