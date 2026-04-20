<?php

namespace App\Http\Controllers;

use App\Models\ContactSettings;
use App\Models\PortfolioItem;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Public portfolio page with all published projects.
     */
    public function index()
    {
        $locale = app()->getLocale();

        $portfolioItems = PortfolioItem::query()
            ->where('locale', $locale)
            ->where('is_published', true)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
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

        // Fallback: if no published entries exist for the active locale, show published
        // projects from any locale instead of an empty portfolio.
        if ($portfolioItems->isEmpty()) {
            $portfolioItems = PortfolioItem::query()
                ->where('is_published', true)
                ->orderByRaw('COALESCE(sort_order, 999999)')
                ->orderBy('id')
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

        return Inertia::render('public/portfolio', [
            'portfolioItems' => $portfolioItems,
            'translations' => trans('website'),
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en', 'ro']),
        ]);
    }

    /**
     * Single project detail page with gallery.
     */
    public function show(string $identifier)
    {
        $portfolioItem = PortfolioItem::query()
            ->where(function ($query) use ($identifier) {
                $query->where('slug', $identifier);

                if (ctype_digit($identifier)) {
                    $query->orWhere('id', (int) $identifier);
                }
            })
            ->where('locale', app()->getLocale())
            ->where('is_published', true)
            ->first();

        // If this slug is not available in current locale, fall back to any published locale.
        if (! $portfolioItem) {
            $portfolioItem = PortfolioItem::query()
                ->where(function ($query) use ($identifier) {
                    $query->where('slug', $identifier);

                    if (ctype_digit($identifier)) {
                        $query->orWhere('id', (int) $identifier);
                    }
                })
                ->where('is_published', true)
                ->firstOrFail();
        }

        $portfolioItem->load(['gallery' => fn ($q) => $q->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id')]);

        $similarItems = PortfolioItem::query()
            ->where('is_published', true)
            ->where('locale', $portfolioItem->locale)
            ->where('id', '!=', $portfolioItem->id)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->limit(4)
            ->get([
                'id',
                'title',
                'slug',
                'short_description',
                'image_path',
                'date',
                'duration',
            ]);

        if ($similarItems->isEmpty()) {
            $similarItems = PortfolioItem::query()
                ->where('is_published', true)
                ->where('id', '!=', $portfolioItem->id)
                ->orderByRaw('COALESCE(sort_order, 999999)')
                ->orderBy('id')
                ->limit(4)
                ->get([
                    'id',
                    'title',
                    'slug',
                    'short_description',
                    'image_path',
                    'date',
                    'duration',
                ]);
        }

        $contact = ContactSettings::resolveForLocale($portfolioItem->locale);

        $listingUpdated = $portfolioItem->updated_at?->locale(app()->getLocale())->translatedFormat('d M Y');

        return Inertia::render('public/portfolio-project', [
            'portfolioItem' => $portfolioItem,
            'similarItems' => $similarItems,
            'contact' => $contact,
            'listingUpdated' => $listingUpdated,
            'translations' => trans('website'),
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en', 'ro']),
        ]);
    }
}
