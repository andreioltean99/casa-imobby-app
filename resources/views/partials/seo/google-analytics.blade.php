@php
    $gaEnv = config('services.google_analytics.enabled');
    $showGoogleAnalytics = $gaEnv === null
        ? app()->environment('production')
        : filter_var($gaEnv, FILTER_VALIDATE_BOOLEAN);
@endphp
@if($showGoogleAnalytics)
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VYT974F76E"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-VYT974F76E');
    </script>
@endif
