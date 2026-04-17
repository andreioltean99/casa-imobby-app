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

        $projectsPublishedCount = PortfolioItem::where('locale', $locale)->where('is_published', true)->count();
        $testimonialsPublishedCount = Testimonial::where('is_published', true)->count();

        $projectsDraftCount = PortfolioItem::where('locale', $locale)->where('is_published', false)->count();

        $projectsCreatedLast30DaysCount = PortfolioItem::where('locale', $locale)->where('created_at', '>=', now()->subDays(30))->count();

        return Inertia::render('dashboard', [
            'projectsPublishedCount' => $projectsPublishedCount,
            'testimonialsPublishedCount' => $testimonialsPublishedCount,
            'projectsDraftCount' => $projectsDraftCount,
            'projectsCreatedLast30DaysCount' => $projectsCreatedLast30DaysCount,
        ]);
    }
}
