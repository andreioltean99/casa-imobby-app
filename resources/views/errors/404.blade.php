@php
    $availableLocales = config('app.available_locales', ['en', 'ro']);
    $selectedLocale = session('locale')
        ?? request()->cookie('site_locale')
        ?? app()->getLocale();
    if (! in_array($selectedLocale, $availableLocales, true)) {
        $selectedLocale = app()->getLocale();
    }
    $isEnglish = $selectedLocale === 'en';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $selectedLocale) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - {{ __('website.brand.site_name') }}</title>

    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('favicon-32.png') }}" type="image/png" sizes="32x32">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link
        href="https://fonts.bunny.net/css?family=dancing-script:600,700|montserrat:400,500,600,700"
        rel="stylesheet"
    />

    <style>
        :root {
            --accent: #1d5e9b;
            --accent-hover: #164a7a;
            --text: #171717;
            --muted: #6b7280;
            --panel: #ffffff;
            --border: #e5e7eb;
            --bg: linear-gradient(180deg, #ffffff 0%, #f3f8fc 100%);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Montserrat", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
                sans-serif;
            color: var(--text);
            background: var(--bg);
        }

        .wrap {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .top {
            border-bottom: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(6px);
        }

        .top-inner {
            max-width: 72rem;
            margin: 0 auto;
            padding: 0.9rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.65rem;
            text-decoration: none;
            color: inherit;
        }

        .logo-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.6rem;
            background: rgba(29, 94, 155, 0.08);
            border: 1px solid rgba(29, 94, 155, 0.22);
            padding: 0.15rem 0.35rem;
        }

        .logo-badge img {
            height: 2.25rem;
            width: auto;
            display: block;
        }

        .brand-title {
            font-weight: 700;
            font-size: 0.95rem;
            line-height: 1.2;
            font-family: "Montserrat", ui-sans-serif, system-ui, sans-serif;
            letter-spacing: 0.02em;
            color: #1d5e9b;
        }

        .brand-sub {
            color: var(--muted);
            font-size: 0.75rem;
            line-height: 1.2;
        }

        .main {
            flex: 1;
            display: grid;
            place-items: center;
            padding: 1rem;
        }

        .card {
            width: min(100%, 680px);
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 1rem;
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.1);
            padding: 1.35rem 1.1rem;
            text-align: center;
        }

        .code {
            margin: 0;
            font-size: clamp(2.6rem, 8vw, 4.2rem);
            line-height: 1;
            letter-spacing: 0.05em;
            font-weight: 700;
            color: var(--accent);
        }

        h1 {
            margin: 0.7rem 0 0.45rem;
            font-size: clamp(1.25rem, 4vw, 1.7rem);
        }

        .desc {
            margin: 0 auto;
            max-width: 36rem;
            color: var(--muted);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .actions {
            margin-top: 1rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
            justify-content: center;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            padding: 0.55rem 0.95rem;
            border: 1px solid transparent;
            transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .btn-primary {
            background: var(--accent);
            color: #fff;
        }

        .btn-primary:hover {
            background: var(--accent-hover);
        }

        .btn-secondary {
            background: #fff;
            color: var(--text);
            border-color: var(--border);
        }

        .btn-secondary:hover {
            background: #f9fafb;
        }
    </style>
</head>
<body>
<div class="wrap">
    <header class="top">
        <a class="top-inner" href="{{ url('/') }}">
            <span class="logo-badge">
                @include('partials.brand-logo', ['class' => 'blog-brand-logo h-9 w-auto object-contain'])
            </span>
            <span>
                <span class="brand-title">{{ __('website.brand.site_name') }}</span><br>
                <span class="brand-sub">{{ __('website.brand.tagline') }}</span>
            </span>
        </a>
    </header>

    <main class="main">
        <section class="card">
            <p class="code">404</p>
            <h1>{{ $isEnglish ? 'Page not found' : 'Pagina nu a fost gasita' }}</h1>
            <p class="desc">
                {{ $isEnglish
                    ? 'The page you are looking for no longer exists or the address is incorrect. You can return to the homepage or continue to services and portfolio.'
                    : 'Linkul accesat nu mai exista sau adresa este gresita. Poti reveni pe prima pagina sau continua spre servicii si portofoliu.' }}
            </p>
            <div class="actions">
                <a class="btn btn-primary" href="{{ url('/') }}">{{ $isEnglish ? 'Home' : 'Acasa' }}</a>
                <a class="btn btn-secondary" href="{{ url('/services') }}">{{ $isEnglish ? 'Services' : 'Servicii' }}</a>
                <a class="btn btn-secondary" href="{{ url('/portfolio') }}">{{ $isEnglish ? 'Portfolio' : 'Portofoliu' }}</a>
            </div>
        </section>
    </main>
</div>
</body>
</html>
