<?php

namespace App\Http\Controllers;

use App\Models\About;
use App\Models\AboutItem;
use App\Models\ContactSettings;
use App\Models\LandingHeroSettings;
use App\Models\PortfolioItem;
use App\Models\Principle;
use App\Models\Testimonial;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Public landing page.
     */
    public function __invoke()
    {
        $testimonials = Testimonial::query()
            ->where('is_published', true)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get([
                'id',
                'name',
                'role',
                'quote',
                'image_path',
            ]);

        $portfolioItems = PortfolioItem::query()
            ->where('locale', app()->getLocale())
            ->where('is_published', true)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->limit(6)
            ->get([
                'id',
                'title',
                'slug',
                'short_description',
                'description',
                'image_path',
                'date',
                'duration',
            ]);

        // If current locale has no published projects, fall back to any published locale
        // so home cards still open real project detail pages.
        if ($portfolioItems->isEmpty()) {
            $portfolioItems = PortfolioItem::query()
                ->where('is_published', true)
                ->orderByRaw('COALESCE(sort_order, 999999)')
                ->orderBy('id')
                ->limit(6)
                ->get([
                    'id',
                    'title',
                    'slug',
                    'short_description',
                    'description',
                    'image_path',
                    'date',
                    'duration',
                ]);
        }

        $aboutLocale = app()->getLocale();
        $about = About::where('locale', $aboutLocale)->first();
        $aboutItems = AboutItem::where('locale', $aboutLocale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get(['id', 'label', 'text']);
        $principles = Principle::where('locale', $aboutLocale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get(['id', 'text']);

        $locale = app()->getLocale();

        $contact = ContactSettings::resolveForLocale($locale);

        $websiteTranslations = trans('website');
        $heroDefaults = $websiteTranslations['hero'] ?? [];

        $landingHero = LandingHeroSettings::query()->firstOrCreate(
            ['locale' => app()->getLocale()],
            [
                'eyebrow' => $heroDefaults['eyebrow'] ?? 'Real estate with confidence',
                'title' => $heroDefaults['title'] ?? 'Find the home or investment that fits your plans.',
                'body' => $heroDefaults['body'] ?? 'Casa Imobby is a Romanian real estate agency guiding clients through buying, selling and renting — from first viewing to signing, with clear advice at every step.',
                'primary_cta' => $heroDefaults['primary_cta'] ?? 'Get in touch',
                'secondary_cta' => $heroDefaults['secondary_cta'] ?? 'Request offer',

                'end_to_end_heading' => $heroDefaults['end_to_end_heading'] ?? 'How we work with you',

                'step1_title' => $heroDefaults['step1_title'] ?? 'Brief & market context',
                'step1_body' => $heroDefaults['step1_body'] ?? '',
                'step2_title' => $heroDefaults['step2_title'] ?? 'Shortlist & viewings',
                'step2_body' => $heroDefaults['step2_body'] ?? '',
                'step3_title' => $heroDefaults['step3_title'] ?? 'Offer to closing',
                'step3_body' => $heroDefaults['step3_body'] ?? '',
            ],
        );

        return Inertia::render('public/home', [
            'testimonials' => $testimonials,
            'portfolioItems' => $portfolioItems,
            'about' => $about,
            'aboutItems' => $aboutItems,
            'principles' => $principles,
            'contact' => $contact,
            'hero' => $landingHero,
            'translations' => trans('website'),
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en', 'ro']),
        ]);
    }
}
