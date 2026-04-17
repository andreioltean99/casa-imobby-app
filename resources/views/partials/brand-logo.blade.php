@php
    $logoClass = $class ?? 'blog-brand-logo flex-shrink-0 h-9 w-auto sm:h-10 object-contain object-left';
@endphp
<img
    src="{{ asset('logo-casa-imobby.png') }}"
    alt="{{ config('branding.site_name', 'Casa Imobby') }}"
    class="{{ $logoClass }}"
    width="180"
    height="48"
    loading="eager"
    decoding="async"
/>
