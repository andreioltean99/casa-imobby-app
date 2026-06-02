<?php

namespace App\Http\Middleware;

use App\Models\ContactSubmission;
use App\Models\LeadSubmission;
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
            'appUrl' => rtrim((string) config('app.url', $request->getSchemeAndHttpHost()), '/'),
            'locale' => app()->getLocale(),
            'availableLocales' => (array) config('app.available_locales', ['ro', 'en']),
            'websiteUi' => fn () => [
                'nav' => Lang::get('website.nav'),
                'brand' => Lang::get('website.brand'),
                'footer' => Lang::get('website.footer'),
            ],
            'authUi' => Lang::get('auth'),
            'auth' => [
                'user' => $request->user(),
            ],
            'adminUnread' => fn () => $request->user() ? [
                'leadSubmissions' => LeadSubmission::query()->whereNull('read_at')->count(),
                'contactMessages' => ContactSubmission::query()->whereNull('read_at')->count(),
            ] : null,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'portfolioListingAdmin' => [
                'categoryLabel' => __('website.portfolio.listing_category_label'),
                'categoryPlaceholder' => __('website.portfolio.listing_category_placeholder'),
                'pinnedHomeLabel' => __('website.portfolio.pinned_home_label'),
                'pinnedHomeOrderLabel' => __('website.portfolio.pinned_home_order_label'),
                'categoryTitles' => PortfolioListingCategory::titlesForLocale(app()->getLocale()),
            ],
            'listingCategoryOptions' => PortfolioListingCategory::activeOptionsForForm(app()->getLocale()),
            'admin' => Lang::get('admin'),
            'flash' => [
                'contact_submitted' => fn () => $request->session()->get('contact_submitted'),
                'lead_offer_submitted' => fn () => $request->session()->get('lead_offer_submitted'),
            ],
        ];
    }
}
