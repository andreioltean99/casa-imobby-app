<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\SetLocaleFromSession;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'site_locale', 'admin_locale']);
        // Respect X-Forwarded-* headers when running behind reverse proxies (HTTPS, host, port).
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            SetLocaleFromSession::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return null;
            }

            $availableLocales = (array) config('app.available_locales', ['en', 'ro']);
            $selectedLocale = $request->hasSession()
                ? $request->session()->get('site_locale')
                : null;
            $selectedLocale = $selectedLocale
                ?? $request->cookie('site_locale')
                ?? config('app.locale');

            if (! in_array($selectedLocale, $availableLocales, true)) {
                $selectedLocale = config('app.locale');
            }

            app()->setLocale($selectedLocale);

            return Inertia::render('public/not-found', [
                'translations' => trans('website'),
                'locale' => $selectedLocale,
                'availableLocales' => $availableLocales,
            ])->toResponse($request)->setStatusCode(404);
        });
    })->create();
