<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocaleFromSession
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $available = (array) config('app.available_locales', ['ro', 'en']);
        $fallbackLocale = (string) config('app.fallback_locale', config('app.locale', 'ro'));

        $isAdminRequest = $request->is('dashboard*')
            || $request->is('login')
            || $request->is('register')
            || $request->is('forgot-password')
            || $request->is('reset-password/*')
            || $request->is('two-factor-challenge')
            || $request->is('user/confirm-password');

        if ($isAdminRequest) {
            $locale = session('admin_locale')
                ?? $request->cookie('admin_locale')
                ?? config('app.locale');
        } else {
            $locale = session('site_locale')
                ?? $request->cookie('site_locale')
                ?? config('app.locale');
        }

        if (! in_array($locale, $available, true)) {
            $locale = $fallbackLocale;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}

