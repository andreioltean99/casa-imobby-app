<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1e293b;">
    <p>{{ __('website.portfolio.price_drop_mail_intro', [], $locale) }}</p>
    <p><strong>{{ $item->title }}</strong></p>
    <ul>
        <li>{{ __('website.portfolio.price_drop_mail_old', [], $locale) }} <strong>{{ number_format($oldPrice, 2, ',', '.') }} €</strong></li>
        <li>{{ __('website.portfolio.price_drop_mail_new', [], $locale) }} <strong>{{ number_format($newPrice, 2, ',', '.') }} €</strong></li>
    </ul>
    <p>
        <a href="{{ $listingUrl }}" style="display:inline-block;padding:10px 16px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">
            {{ __('website.portfolio.price_drop_mail_cta', [], $locale) }}
        </a>
    </p>
    <p style="font-size:12px;color:#64748b;">{{ __('website.portfolio.price_drop_mail_footer', ['name' => config('app.name')], $locale) }}</p>
</body>
</html>
