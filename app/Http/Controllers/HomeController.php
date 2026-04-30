<?php

namespace App\Http\Controllers;

use App\Models\About;
use App\Models\AboutItem;
use App\Models\ContactSettings;
use App\Models\LandingHeroSettings;
use App\Models\PortfolioItem;
use App\Models\PortfolioListingCategory;
use App\Models\Principle;
use App\Models\Testimonial;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
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

        $locale = app()->getLocale();
        $portfolioCategoryBlocks = $this->portfolioCategoryBlocksForLocale($locale);

        if ($portfolioCategoryBlocks === []) {
            $portfolioCategoryBlocks = $this->portfolioCategoryBlocksForLocale(null);
        }

        $aboutLocale = $locale;
        $about = About::where('locale', $aboutLocale)->first();
        $aboutItems = AboutItem::where('locale', $aboutLocale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get(['id', 'label', 'text']);
        $principles = Principle::where('locale', $aboutLocale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get(['id', 'text']);

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
            'portfolioCategoryBlocks' => $portfolioCategoryBlocks,
            'listingCategoryTitles' => PortfolioListingCategory::titlesForLocale($locale),
            'about' => $about,
            'aboutItems' => $aboutItems,
            'principles' => $principles,
            'contact' => $contact,
            'hero' => $landingHero,
            'propertySearchOptions' => [
                'types' => $this->searchPropertyTypesForLocale($locale),
                'cityZones' => $this->searchCityZonesForLocale($locale),
            ],
            'translations' => trans('website'),
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en', 'ro']),
        ]);
    }

    /**
     * @return list<array{category: string, items: Collection<int, PortfolioItem>}>
     */
    protected function portfolioCategoryBlocksForLocale(?string $locale): array
    {
        $columns = [
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'image_path',
            'date',
            'duration',
            'price',
        ];

        $blocks = [];
        foreach (PortfolioListingCategory::query()->active()->ordered()->get() as $category) {
            $query = PortfolioItem::query()
                ->where('is_published', true)
                ->where('listing_category', $category->key);

            if ($locale !== null) {
                $query->where('locale', $locale);
            }

            $items = $query
                ->orderByDesc('pinned_home')
                ->orderByRaw('COALESCE(pinned_home_order, 999999)')
                ->orderByRaw('COALESCE(sort_order, 999999)')
                ->orderBy('id')
                ->limit(3)
                ->get($columns);

            if ($items->isNotEmpty()) {
                $blocks[] = [
                    'category' => $category->key,
                    'items' => $items,
                ];
            }
        }

        return $blocks;
    }

    /**
     * @return list<string>
     */
    protected function searchPropertyTypesForLocale(string $locale): array
    {
        $categories = PortfolioItem::query()
            ->where('is_published', true)
            ->where('locale', $locale)
            ->pluck('listing_category')
            ->filter(fn ($value) => is_string($value) && $value !== '')
            ->values()
            ->all();

        if ($categories === []) {
            $categories = PortfolioItem::query()
                ->where('is_published', true)
                ->pluck('listing_category')
                ->filter(fn ($value) => is_string($value) && $value !== '')
                ->values()
                ->all();
        }

        $types = [];
        foreach ($categories as $key) {
            $types[] = match (true) {
                Str::startsWith($key, 'apartment_') => 'apartment',
                Str::startsWith($key, 'case_'), Str::startsWith($key, 'house_') => 'house',
                Str::startsWith($key, 'office_') => 'office',
                Str::startsWith($key, 'commercial_') => 'commercial',
                Str::startsWith($key, 'industrial_') => 'industrial',
                Str::startsWith($key, 'land_') => 'land',
                default => null,
            };
        }

        return collect($types)
            ->filter(fn ($value) => is_string($value) && $value !== '')
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    protected function searchCityZonesForLocale(string $locale): array
    {
        $zones = PortfolioItem::query()
            ->where('is_published', true)
            ->where('locale', $locale)
            ->whereNotNull('zone')
            ->orderBy('zone')
            ->pluck('zone')
            ->map(fn ($value) => is_string($value) ? trim($value) : '')
            ->filter(fn (string $value) => $value !== '')
            ->unique()
            ->values();

        if ($zones->isNotEmpty()) {
            return $zones->all();
        }

        return PortfolioItem::query()
            ->where('is_published', true)
            ->whereNotNull('zone')
            ->orderBy('zone')
            ->pluck('zone')
            ->map(fn ($value) => is_string($value) ? trim($value) : '')
            ->filter(fn (string $value) => $value !== '')
            ->unique()
            ->values()
            ->all();
    }
}
