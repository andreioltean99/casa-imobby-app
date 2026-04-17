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
        $available = (array) config('app.available_locales', ['en', 'ro']);

        $isAdminRequest = $request->is('dashboard*');

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
            $locale = config('app.locale');
        }

        app()->setLocale($locale);

        return $next($request);
    }
}

