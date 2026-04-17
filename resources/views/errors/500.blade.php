@php
    $showDetails = (bool) env('APP_SHOW_ERROR_DETAILS', false) || config('app.debug');
    $errorMessage = isset($exception) && $exception ? $exception->getMessage() : null;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>500 - Server Error</title>
    <style>
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .card {
            width: 100%;
            max-width: 880px;
            border: 1px solid #334155;
            background: #111827;
            border-radius: 12px;
            padding: 20px;
            box-sizing: border-box;
        }
        .title {
            margin: 0 0 8px;
            font-size: 24px;
            font-weight: 700;
        }
        .meta {
            margin: 0 0 16px;
            color: #94a3b8;
            font-size: 14px;
        }
        .box {
            background: #0b1220;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 12px;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            font-size: 13px;
            line-height: 1.5;
        }
        .hint {
            margin-top: 12px;
            font-size: 13px;
            color: #93c5fd;
        }
        .danger {
            margin-top: 12px;
            font-size: 13px;
            color: #fca5a5;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1 class="title">500 - Server Error</h1>
        <p class="meta">The request could not be completed due to an internal error.</p>

        @if($showDetails)
            <div class="box">{{ $errorMessage ?: 'No exception message available.' }}</div>
            <p class="danger">
                Error details are visible because <code>APP_SHOW_ERROR_DETAILS=true</code> or <code>APP_DEBUG=true</code>.
            </p>
        @else
            <div class="box">An unexpected error occurred. Please check application logs for details.</div>
            <p class="hint">
                For temporary diagnostics set <code>APP_SHOW_ERROR_DETAILS=true</code>, then clear config cache.
            </p>
        @endif
    </div>
</body>
</html>
