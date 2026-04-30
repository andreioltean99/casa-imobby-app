<?php

namespace App\Http\Middleware;

use App\Models\PortfolioListingCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => app()->getLocale(),
            'availableLocales' => (array) config('app.available_locales', ['en', 'ro']),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'portfolioListingAdmin' => [
                'categoryLabel' => __('website.portfolio.listing_category_label'),
                'categoryPlaceholder' => __('website.portfolio.listing_category_placeholder'),
                'pinnedHomeLabel' => __('website.portfolio.pinned_home_label'),
                'pinnedHomeOrderLabel' => __('website.portfolio.pinned_home_order_label'),
                'categoryTitles' => PortfolioListingCategory::titlesForLocale(app()->getLocale()),
            ],
            'admin' => Lang::get('admin'),
        ];
    }
}
