<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\PortfolioItemImage;
use App\Models\PortfolioListingCategory;
use App\Models\PortfolioPriceAlertSubscription;
use App\Models\PropertyFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PortfolioDashboardController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $characteristicFilters = $this->characteristicFiltersForAdmin($locale);
        $characteristicState = $this->resolveCharacteristicState($request, $characteristicFilters);
        $search = trim((string) $request->query('q', ''));

        $itemsQuery = PortfolioItem::query()
            ->where('locale', $locale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id');

        if ($search !== '') {
            $needle = '%'.$search.'%';
            $itemsQuery->where(function (Builder $q) use ($needle) {
                $q->where('title', 'like', $needle)
                    ->orWhereHas('propertyFilterValues', function (Builder $vf) use ($needle) {
                        $vf->where('value', 'like', $needle);
                    });
            });
        }

        foreach ($characteristicState as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $needle = '%'.$value.'%';
            $itemsQuery->whereHas('propertyFilterValues', function (Builder $q) use ($key, $needle) {
                $q->where('value', 'like', $needle)
                    ->whereHas('propertyFilter', fn (Builder $f) => $f->where('key', $key));
            });
        }

        $items = $itemsQuery->get([
                'id',
                'title',
                'slug',
                'short_description',
                'description',
                'image_path',
                'date',
                'duration',
                'is_published',
                'sort_order',
                'price',
                'listing_category',
                'zone',
                'pinned_home',
            ]);

        return Inertia::render('dashboard/portfolio', [
            'portfolioItems' => $items,
            'characteristicFilters' => $characteristicFilters,
            'characteristicFilterState' => $characteristicState,
            'searchQuery' => $search !== '' ? $search : null,
        ]);
    }

    public function create()
    {
        $locale = app()->getLocale();

        return Inertia::render('dashboard/portfolio-create', [
            'listingCategoryOptions' => PortfolioListingCategory::optionsForForm($locale),
            'propertyFilterOptions' => PropertyFilter::optionsForForm($locale),
        ]);
    }

    public function edit(PortfolioItem $portfolioItem)
    {
        if ($portfolioItem->locale !== app()->getLocale()) {
            $localized = PortfolioItem::query()
                ->where('slug', $portfolioItem->slug)
                ->where('locale', app()->getLocale())
                ->first();

            // Fallback by title in case slug diverged between locales.
            if (! $localized) {
                $localized = PortfolioItem::query()
                    ->where('title', $portfolioItem->title)
                    ->where('locale', app()->getLocale())
                    ->first();
            }

            if ($localized) {
                return redirect()
                    ->route('dashboard.portfolio.edit', $localized)
                    ->with('status', 'Switched to the selected language.');
            }

            return redirect()
                ->route('dashboard.portfolio.index')
                ->with('status', 'No project translation exists in the selected language.');
        }

        $portfolioItem->load([
            'gallery' => fn ($q) => $q->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id'),
            'propertyFilterValues.propertyFilter',
        ]);

        $locale = app()->getLocale();

        return Inertia::render('dashboard/portfolio-edit', [
            'portfolioItem' => $portfolioItem,
            'listingCategoryOptions' => PortfolioListingCategory::optionsForForm($locale),
            'propertyFilterOptions' => PropertyFilter::optionsForForm($locale),
        ]);
    }

    public function store(Request $request)
    {
        $locale = app()->getLocale();
        $data = $this->validatedData($request);
        $data['slug'] = 'pending-'.Str::lower(Str::random(16));
        $data['locale'] = $locale;
        $data['listing_specs'] = $this->parseListingSpecsJson($request->input('listing_specs_json'));
        $data['external_listing_ref'] = $this->nullableString($data['external_listing_ref'] ?? null);
        $data['pinned_home'] = $request->boolean('pinned_home');
        unset($data['listing_specs_json']);

        if (array_key_exists('price', $data)) {
            $data['price'] = $data['price'] === '' || $data['price'] === null ? null : $data['price'];
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('portfolio', 'public');
        }

        if ($request->hasFile('listing_pdf')) {
            $data['listing_pdf_path'] = $request->file('listing_pdf')->store('portfolio/pdfs', 'public');
        }

        $portfolioItem = PortfolioItem::create($data);
        $this->syncPropertyFilterValues($portfolioItem, $request->input('property_filters_json'));

        if ($request->hasFile('gallery_images')) {
            $order = 0;
            foreach ((array) $request->file('gallery_images') as $file) {
                if (! $file) {
                    continue;
                }
                $portfolioItem->gallery()->create([
                    'image_path' => $file->store('portfolio/gallery', 'public'),
                    'sort_order' => $order++,
                ]);
            }
        }

        return redirect()
            ->route('dashboard.portfolio.index')
            ->with('status', 'Portfolio project created.');
    }

    public function update(Request $request, PortfolioItem $portfolioItem)
    {
        $locale = app()->getLocale();
        if ($portfolioItem->locale !== $locale) {
            abort(404);
        }

        $oldPrice = $portfolioItem->price;

        $data = $this->validatedData($request);
        $data['locale'] = $locale;
        $data['listing_specs'] = $this->parseListingSpecsJson($request->input('listing_specs_json'));
        $data['external_listing_ref'] = $this->nullableString($data['external_listing_ref'] ?? null);
        $data['pinned_home'] = $request->boolean('pinned_home');
        unset($data['listing_specs_json']);

        if (array_key_exists('price', $data)) {
            $data['price'] = $data['price'] === '' || $data['price'] === null ? null : $data['price'];
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('portfolio', 'public');
        }

        if ($request->hasFile('listing_pdf')) {
            if ($portfolioItem->listing_pdf_path) {
                Storage::disk('public')->delete($portfolioItem->listing_pdf_path);
            }
            $data['listing_pdf_path'] = $request->file('listing_pdf')->store('portfolio/pdfs', 'public');
        }

        $portfolioItem->update($data);
        $this->syncPropertyFilterValues($portfolioItem, $request->input('property_filters_json'));
        $portfolioItem->refresh();
        $portfolioItem->assignPublicSlug();

        PortfolioPriceAlertSubscription::notifySubscribersIfPriceDropped(
            $portfolioItem,
            $oldPrice,
            $portfolioItem->price,
        );

        return redirect()
            ->route('dashboard.portfolio.index')
            ->with('status', 'Portfolio project updated.');
    }

    public function destroy(PortfolioItem $portfolioItem)
    {
        if ($portfolioItem->locale !== app()->getLocale()) {
            abort(404);
        }

        if ($portfolioItem->listing_pdf_path) {
            Storage::disk('public')->delete($portfolioItem->listing_pdf_path);
        }

        $portfolioItem->delete();

        return redirect()
            ->route('dashboard.portfolio.index')
            ->with('status', 'Portfolio project deleted.');
    }

    public function storeGalleryImage(Request $request, PortfolioItem $portfolioItem)
    {
        if ($portfolioItem->locale !== app()->getLocale()) {
            abort(404);
        }

        $files = [];
        if ($request->hasFile('images')) {
            $uploaded = $request->file('images');
            $files = is_array($uploaded)
                ? array_values(array_filter($uploaded))
                : array_filter([$uploaded]);
        }
        if ($request->hasFile('image')) {
            $files[] = $request->file('image');
        }

        $files = array_values(array_filter(
            $files,
            fn ($f) => $f instanceof UploadedFile && $f->isValid(),
        ));

        if ($files === []) {
            return redirect()
                ->route('dashboard.portfolio.edit', $portfolioItem)
                ->withErrors(['images' => 'Select at least one image.']);
        }

        if (count($files) > 30) {
            return redirect()
                ->route('dashboard.portfolio.edit', $portfolioItem)
                ->withErrors(['images' => 'You can upload at most 30 images at once.']);
        }

        $validator = Validator::make(
            ['gallery_files' => $files],
            ['gallery_files.*' => ['image', 'max:4096']],
        );

        if ($validator->fails()) {
            return redirect()
                ->route('dashboard.portfolio.edit', $portfolioItem)
                ->withErrors(['images' => $validator->errors()->first() ?? 'Invalid image.']);
        }

        $maxOrder = (int) ($portfolioItem->gallery()->max('sort_order') ?? -1);

        foreach ($files as $file) {
            $maxOrder++;
            $path = $file->store('portfolio/gallery', 'public');
            $portfolioItem->gallery()->create([
                'image_path' => $path,
                'sort_order' => $maxOrder,
            ]);
        }

        $count = count($files);
        $message = $count === 1
            ? 'Gallery image added.'
            : "Added {$count} gallery images.";

        return redirect()
            ->route('dashboard.portfolio.edit', $portfolioItem)
            ->with('status', $message);
    }

    public function destroyGalleryImage(PortfolioItem $portfolioItem, PortfolioItemImage $image)
    {
        if ($portfolioItem->locale !== app()->getLocale()) {
            abort(404);
        }
        if ($image->portfolio_item_id !== $portfolioItem->id) {
            abort(404);
        }
        $image->delete();

        return redirect()
            ->route('dashboard.portfolio.edit', $portfolioItem)
            ->with('status', 'Gallery image removed.');
    }

    protected function uniqueSlug(string $slug, string $locale, ?int $excludeId = null): string
    {
        $base = $slug;
        $i = 0;
        while (true) {
            $query = PortfolioItem::where('slug', $slug)->where('locale', $locale);
            if ($excludeId !== null) {
                $query->where('id', '!=', $excludeId);
            }
            if (! $query->exists()) {
                return $slug;
            }
            $i++;
            $slug = $base.'-'.$i;
        }
    }

    protected function validatedData(Request $request): array
    {
        $request->merge([
            'external_storia_url' => $this->nullableString((string) $request->input('external_storia_url', '')),
            'external_imobiliare_url' => $this->nullableString((string) $request->input('external_imobiliare_url', '')),
            'external_olx_url' => $this->nullableString((string) $request->input('external_olx_url', '')),
            'listing_category' => $this->nullableString((string) $request->input('listing_category', '')),
            'zone' => $this->nullableString((string) $request->input('zone', '')),
            'pinned_home_order' => $request->input('pinned_home_order') === '' || $request->input('pinned_home_order') === null
                ? null
                : $request->input('pinned_home_order'),
        ]);

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:300'],
            'date' => ['nullable', 'string', 'max:100'],
            'duration' => ['nullable', 'string', 'max:100'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:4096'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'max:4096'],
            'listing_specs_json' => ['nullable', 'string', 'max:65535'],
            'property_filters_json' => ['nullable', 'string', 'max:65535'],
            'external_listing_ref' => ['nullable', 'string', 'max:120'],
            'external_storia_url' => ['nullable', 'string', 'max:2048', 'url'],
            'external_imobiliare_url' => ['nullable', 'string', 'max:2048', 'url'],
            'external_olx_url' => ['nullable', 'string', 'max:2048', 'url'],
            'listing_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:15360'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'listing_category' => ['nullable', 'string', Rule::exists('portfolio_listing_categories', 'key')],
            'zone' => ['nullable', 'string', 'max:120'],
            'pinned_home' => ['sometimes', 'boolean'],
            'pinned_home_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);
    }

    /**
     * @return list<array{label: string, value: string}>|null
     */
    protected function parseListingSpecsJson(?string $json): ?array
    {
        if ($json === null || $json === '') {
            return null;
        }

        $decoded = json_decode($json, true);
        if (! is_array($decoded)) {
            return null;
        }

        $rows = [];
        foreach ($decoded as $row) {
            if (! is_array($row)) {
                continue;
            }
            $label = isset($row['label']) ? trim((string) $row['label']) : '';
            $value = isset($row['value']) ? trim((string) $row['value']) : '';
            if ($label === '' && $value === '') {
                continue;
            }
            $rows[] = [
                'label' => Str::limit($label, 120, ''),
                'value' => Str::limit($value, 500, ''),
            ];
        }

        return $rows === [] ? null : $rows;
    }

    protected function nullableString(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    protected function syncPropertyFilterValues(PortfolioItem $portfolioItem, ?string $json): void
    {
        $rows = $this->parsePropertyFiltersJson($json);
        $portfolioItem->propertyFilterValues()->delete();

        if ($rows === []) {
            return;
        }

        foreach ($rows as $index => $row) {
            $portfolioItem->propertyFilterValues()->create([
                'property_filter_id' => $row['property_filter_id'],
                'value' => $row['value'],
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * @return list<array{property_filter_id: int, value: string}>
     */
    protected function parsePropertyFiltersJson(?string $json): array
    {
        if ($json === null || $json === '') {
            return [];
        }

        $decoded = json_decode($json, true);
        if (! is_array($decoded)) {
            return [];
        }

        $activeFilters = PropertyFilter::query()->pluck('id')->map(fn ($id) => (int) $id)->all();
        $allowedIds = array_fill_keys($activeFilters, true);
        $rows = [];

        foreach ($decoded as $row) {
            if (! is_array($row)) {
                continue;
            }

            $filterId = isset($row['property_filter_id']) ? (int) $row['property_filter_id'] : 0;
            $value = isset($row['value']) ? trim((string) $row['value']) : '';

            if ($filterId <= 0 || ! isset($allowedIds[$filterId]) || $value === '') {
                continue;
            }

            $rows[] = [
                'property_filter_id' => $filterId,
                'value' => Str::limit($value, 255, ''),
            ];
        }

        return $rows;
    }

    /**
     * @return list<array{key: string, label: string}>
     */
    protected function characteristicFiltersForAdmin(string $locale): array
    {
        $filters = PropertyFilter::query()
            ->active()
            ->searchable()
            ->ordered()
            ->get(['id', 'key', 'name_en', 'name_ro']);

        return $filters
            ->map(fn (PropertyFilter $filter) => [
                'key' => $filter->key,
                'label' => $filter->nameForLocale($locale),
            ])
            ->values()
            ->all();
    }

    /**
     * @param  list<array{key: string, label: string}>  $characteristicFilters
     * @return array<string, string|null>
     */
    protected function resolveCharacteristicState(Request $request, array $characteristicFilters): array
    {
        $state = [];
        foreach ($characteristicFilters as $filter) {
            $key = $filter['key'];
            $value = trim((string) $request->query("cf_{$key}", ''));
            $state[$key] = $value !== '' ? $value : null;
        }

        return $state;
    }
}
