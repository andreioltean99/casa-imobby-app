<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\Testimonial;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        $listingsPublishedCount = PortfolioItem::where('locale', $locale)->where('is_published', true)->count();
        $testimonialsPublishedCount = Testimonial::where('is_published', true)->count();

        $listingsDraftCount = PortfolioItem::where('locale', $locale)->where('is_published', false)->count();

        $listingsCreatedLast30DaysCount = PortfolioItem::where('locale', $locale)->where('created_at', '>=', now()->subDays(30))->count();

        return Inertia::render('dashboard', [
            'listingsPublishedCount' => $listingsPublishedCount,
            'testimonialsPublishedCount' => $testimonialsPublishedCount,
            'listingsDraftCount' => $listingsDraftCount,
            'listingsCreatedLast30DaysCount' => $listingsCreatedLast30DaysCount,
        ]);
    }
}
