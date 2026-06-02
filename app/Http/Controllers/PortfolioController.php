<?php

namespace App\Http\Controllers;

use App\Models\ContactSettings;
use App\Models\PortfolioItem;
use App\Models\PortfolioListingCategory;
use App\Models\PropertyFilter;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Public properties index: all published listings with optional filters (sidebar + search strip).
     */
    public function index(Request $request)
    {
        $locale = app()->getLocale();
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
            'listing_category',
            'zone',
        ];

        $categoryKeys = $this->resolveListingCategoryKeys($request);
        $deal = $this->normalizeDeal($request->query('deal'));
        $type = $this->normalizePropertyType($request->query('type'));
        $cityZoneOptions = $this->resolveCityZoneOptions();
        $city = $this->normalizeCity($request->query('city'), $cityZoneOptions);
        $q = trim((string) $request->query('q', ''));
        $searchableFilters = PropertyFilter::searchableOptionsForPublic($locale);
        $dynamicFilterState = $this->resolveDynamicFilterState($request, $searchableFilters);

        $explicitCategory = (string) $request->query('category', '');
        $activeCategory = $explicitCategory !== ''
            && PortfolioListingCategory::query()->where('key', $explicitCategory)->where('is_active', true)->exists()
            ? $explicitCategory
            : null;

        $base = PortfolioItem::query()
            ->where('is_published', true)
            ->when($categoryKeys !== null, fn (Builder $q) => $q->whereIn('listing_category', $categoryKeys));

        $this->applyCityNeedleFilter($base, $city);
        $this->applyTextSearchFilter($base, $q);
        $this->applyPropertyFilters($base, $dynamicFilterState);

        $portfolioItems = (clone $base)
            ->where('locale', $locale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get($columns);

        if ($portfolioItems->isEmpty()) {
            $portfolioItems = (clone $base)
                ->orderByRaw('COALESCE(sort_order, 999999)')
                ->orderBy('id')
                ->get($columns);
        }

        $categoryOptions = PortfolioListingCategory::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (PortfolioListingCategory $c) => [
                'key' => $c->key,
                'label' => $c->nameForLocale($locale),
            ])
            ->values()
            ->all();

        return Inertia::render('public/portfolio', [
            'portfolioItems' => $portfolioItems,
            'activeListingCategory' => $activeCategory,
            'listingCategoryTitles' => PortfolioListingCategory::titlesForLocale($locale),
            'categoryOptions' => $categoryOptions,
            'filterState' => [
                'category' => $activeCategory,
                'deal' => $deal,
                'type' => $type,
                'city' => $city,
                'q' => $q !== '' ? $q : null,
                'dynamic' => $dynamicFilterState,
            ],
            'cityZoneOptions' => $cityZoneOptions,
            'searchablePropertyFilters' => $this->searchableFilterOptionsWithValues($searchableFilters),
            'translations' => trans('website'),
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['ro', 'en']),
        ]);
    }

    /**
     * @return list<string>|null null = no listing_category constraint
     */
    protected function resolveListingCategoryKeys(Request $request): ?array
    {
        $category = (string) $request->query('category', '');
        if ($category !== '' && PortfolioListingCategory::query()->where('key', $category)->where('is_active', true)->exists()) {
            return [$category];
        }

        $deal = $this->normalizeDeal($request->query('deal'));
        $type = $this->normalizePropertyType($request->query('type'));

        return $this->categoryKeysFromDealAndType($deal, $type);
    }

    protected function normalizeDeal(mixed $deal): ?string
    {
        $deal = is_string($deal) ? strtolower(trim($deal)) : null;

        return in_array($deal, ['sale', 'rent'], true) ? $deal : null;
    }

    protected function normalizePropertyType(mixed $type): ?string
    {
        $type = is_string($type) ? strtolower(trim($type)) : '';

        $allowed = ['apartment', 'house', 'office', 'commercial', 'industrial', 'land'];

        return in_array($type, $allowed, true) ? $type : null;
    }

    protected function normalizeCity(mixed $city, array $allowedOptions): ?string
    {
        $city = is_string($city) ? trim($city) : '';
        if ($city === '' || ! in_array($city, $allowedOptions, true)) {
            return null;
        }

        return $city;
    }

    /**
     * @return list<string>|null
     */
    protected function categoryKeysFromDealAndType(?string $deal, ?string $type): ?array
    {
        $activeKeys = PortfolioListingCategory::query()
            ->active()
            ->ordered()
            ->pluck('key')
            ->all();

        if ($type !== null) {
            $suffix = $deal === 'rent' ? '_rent' : '_sale';
            $keys = match ($type) {
                'apartment' => ["apartment{$suffix}"],
                'house' => $deal === 'rent' ? ['house_rent'] : ['case_sale'],
                'land' => $deal === 'rent' ? [] : ['land_sale'],
                'office' => $deal === 'rent' ? [] : ['office_sale'],
                'commercial' => ["commercial{$suffix}"],
                'industrial' => ["industrial{$suffix}"],
                default => [],
            };

            $keys = array_values(array_intersect($keys, $activeKeys));
            if ($keys !== []) {
                return $keys;
            }

            if ($deal === 'rent') {
                return array_values(array_filter($activeKeys, fn (string $k) => str_ends_with($k, '_rent')));
            }
            if ($deal === 'sale') {
                return array_values(array_filter($activeKeys, fn (string $k) => str_ends_with($k, '_sale')));
            }

            return null;
        }

        if ($deal === 'sale') {
            return array_values(array_filter($activeKeys, fn (string $k) => str_ends_with($k, '_sale')));
        }
        if ($deal === 'rent') {
            return array_values(array_filter($activeKeys, fn (string $k) => str_ends_with($k, '_rent')));
        }

        return null;
    }

    protected function applyCityNeedleFilter(Builder $query, ?string $city): void
    {
        if ($city === null) {
            return;
        }
        $query->where('zone', $city);
    }

    /**
     * @return list<string>
     */
    protected function resolveCityZoneOptions(): array
    {
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

    protected function applyTextSearchFilter(Builder $query, string $q): void
    {
        if ($q === '') {
            return;
        }

        $like = '%'.$q.'%';
        $query->where(function (Builder $outer) use ($like) {
            $outer->where('title', 'like', $like)
                ->orWhere('short_description', 'like', $like)
                ->orWhere('description', 'like', $like)
                ->orWhereHas('propertyFilterValues', function (Builder $q) use ($like) {
                    $q->where('value', 'like', $like);
                });
        });
    }

    /**
     * @param  list<array{id: int, key: string, label: string}>  $searchableFilters
     * @return array<string, string|null>
     */
    protected function resolveDynamicFilterState(Request $request, array $searchableFilters): array
    {
        $state = [];
        foreach ($searchableFilters as $filter) {
            $key = (string) $filter['key'];
            $value = trim((string) $request->query("pf_{$key}", ''));
            $state[$key] = $value !== '' ? $value : null;
        }

        return $state;
    }

    /**
     * @param  array<string, string|null>  $dynamicFilterState
     */
    protected function applyPropertyFilters(Builder $query, array $dynamicFilterState): void
    {
        foreach ($dynamicFilterState as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $query->whereHas('propertyFilterValues', function (Builder $q) use ($key, $value) {
                $q->where('value', $value)
                    ->whereHas('propertyFilter', function (Builder $q2) use ($key) {
                        $q2->where('key', $key);
                    });
            });
        }
    }

    /**
     * @param  list<array{id: int, key: string, label: string}>  $searchableFilters
     * @return list<array{id: int, key: string, label: string, values: list<string>}>
     */
    protected function searchableFilterOptionsWithValues(array $searchableFilters): array
    {
        $out = [];
        foreach ($searchableFilters as $filter) {
            $values = \App\Models\PortfolioItemPropertyFilterValue::query()
                ->where('property_filter_id', $filter['id'])
                ->whereHas('portfolioItem', fn (Builder $q) => $q->where('is_published', true))
                ->orderBy('value')
                ->distinct()
                ->pluck('value')
                ->map(fn ($value) => is_string($value) ? trim($value) : '')
                ->filter(fn (string $value) => $value !== '')
                ->unique()
                ->values()
                ->all();

            if ($values === []) {
                continue;
            }

            $out[] = [
                'id' => $filter['id'],
                'key' => $filter['key'],
                'label' => $filter['label'],
                'values' => $values,
            ];
        }

        return $out;
    }

    /**
     * Single project detail page with gallery.
     */
    public function show(string $identifier)
    {
        $portfolioItem = $this->resolvePublishedListing($identifier);

        $canonicalSegment = $portfolioItem->publicUrlSegment();
        if (Str::lower(trim(rawurldecode($identifier))) !== Str::lower($canonicalSegment)) {
            return redirect()->route('portfolio.show', ['slug' => $canonicalSegment], 301);
        }

        $portfolioItem->load([
            'gallery' => fn ($q) => $q
                ->select(['id', 'portfolio_item_id', 'image_path', 'sort_order'])
                ->orderByRaw('COALESCE(sort_order, 999999)')
                ->orderBy('id'),
            'propertyFilterValues' => fn ($q) => $q
                ->select(['id', 'portfolio_item_id', 'property_filter_id', 'value', 'sort_order'])
                ->orderBy('sort_order')
                ->orderBy('id'),
            'propertyFilterValues.propertyFilter' => fn ($q) => $q->select(['id', 'key', 'name_en', 'name_ro']),
        ]);

        $similarItems = $this->similarPublishedListings($portfolioItem);

        $contact = ContactSettings::resolveForLocale($portfolioItem->locale);

        $listingUpdated = $portfolioItem->updated_at?->locale(app()->getLocale())->translatedFormat('d M Y');

        return Inertia::render('public/portfolio-project', [
            'portfolioItem' => $portfolioItem,
            'similarItems' => $similarItems,
            'contact' => $contact,
            'listingUpdated' => $listingUpdated,
            'translations' => [
                'portfolio' => trans('website.portfolio'),
                'units' => trans('website.units'),
            ],
            'locale' => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['ro', 'en']),
        ]);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, PortfolioItem>
     */
    protected function similarPublishedListings(PortfolioItem $portfolioItem)
    {
        $query = PortfolioItem::query()
            ->excludeDemo()
            ->where('is_published', true)
            ->where('locale', $portfolioItem->locale)
            ->where('id', '!=', $portfolioItem->id);

        $externalRef = trim((string) ($portfolioItem->external_listing_ref ?? ''));
        if ($externalRef !== '') {
            $query->where(function (Builder $q) use ($externalRef) {
                $q->whereNull('external_listing_ref')
                    ->orWhere('external_listing_ref', '!=', $externalRef);
            });
        }

        return $query
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

    protected function resolvePublishedListing(string $identifier): PortfolioItem
    {
        $portfolioItem = PortfolioItem::findPublishedByPublicIdentifier($identifier);

        if (! $portfolioItem) {
            abort(404);
        }

        return $portfolioItem;
    }

    /**
     * @return list<array{label: string, value: string}>
     */
    protected function characteristicsFromPropertyFilters(PortfolioItem $portfolioItem, string $locale): array
    {
        $portfolioItem->loadMissing(['propertyFilterValues.propertyFilter']);

        $specs = [];
        foreach ($portfolioItem->propertyFilterValues as $row) {
            $filter = $row->propertyFilter;
            $value = trim((string) $row->value);
            if (! $filter || $value === '') {
                continue;
            }

            $specs[] = [
                'label' => $filter->nameForLocale($locale),
                'value' => $value,
            ];
        }

        return $specs;
    }
}
