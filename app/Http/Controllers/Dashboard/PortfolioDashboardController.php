<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\PortfolioItemImage;
use App\Models\PortfolioListingCategory;
use App\Models\PropertyFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
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
            ->orderByDesc('updated_at')
            ->orderByDesc('id');

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
            'listingCategoryOptions' => PortfolioListingCategory::activeOptionsForForm($locale),
            'propertyFilterOptions' => PropertyFilter::optionsForForm($locale),
        ]);
    }

    public function formOptions(): JsonResponse
    {
        $locale = app()->getLocale();

        return response()->json([
            'propertyFilterOptions' => PropertyFilter::optionsForForm($locale),
            'listingCategoryOptions' => PortfolioListingCategory::activeOptionsForForm($locale),
        ]);
    }

    public function importFromImobiliare(Request $request): JsonResponse
    {
        $data = $request->validate([
            'external_imobiliare_url' => ['required', 'string', 'max:2048', 'url'],
        ]);

        $url = trim((string) $data['external_imobiliare_url']);
        if (! $this->isImobiliareOfferUrl($url)) {
            return response()->json([
                'message' => 'URL invalid. Folosește un link de ofertă de pe imobiliare.ro.',
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; CasaImobbyBot/1.0; +https://casa-imobby.ro)',
                'Accept-Language' => 'ro-RO,ro;q=0.9,en;q=0.8',
            ])
                ->timeout(20)
                ->get($url);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Nu am putut accesa linkul Imobiliare.ro. Încearcă din nou.',
            ], 422);
        }

        if (! $response->ok()) {
            return response()->json([
                'message' => 'Linkul nu poate fi importat momentan (status '.$response->status().').',
            ], 422);
        }

        $payload = $this->extractImobiliarePayload($response->body(), $url);

        return response()->json($payload);
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
            'listingCategoryOptions' => PortfolioListingCategory::activeOptionsForForm($locale),
            'propertyFilterOptions' => PropertyFilter::optionsForForm($locale),
        ]);
    }

    public function store(Request $request)
    {
        $locale = app()->getLocale();
        $data = $this->validatedData($request);
        $data['slug'] = 'pending-'.Str::lower(Str::random(16));
        $data['locale'] = $locale;
        $data['external_listing_ref'] = $this->nullableString($data['external_listing_ref'] ?? null);
        $data['pinned_home'] = $request->boolean('pinned_home');
        $data['listing_specs'] = null;
        $data['date'] = $this->currentListingDisplayDate($locale);

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
        $data['external_listing_ref'] = $this->nullableString($data['external_listing_ref'] ?? null);
        $data['pinned_home'] = $request->boolean('pinned_home');
        $data['listing_specs'] = null;
        $data['date'] = $this->currentListingDisplayDate($locale);

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

        // Removed: price-drop alert subscriptions

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
            'duration' => ['nullable', 'string', 'max:100'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:4096'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['image', 'max:4096'],
            'property_filters_json' => ['nullable', 'string', 'max:65535'],
            'external_listing_ref' => ['nullable', 'string', 'max:120'],
            'external_storia_url' => ['nullable', 'string', 'max:2048', 'url'],
            'external_imobiliare_url' => ['nullable', 'string', 'max:2048', 'url'],
            'external_olx_url' => ['nullable', 'string', 'max:2048', 'url'],
            'listing_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:15360'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999'],
            'listing_category' => [
                'required',
                'string',
                Rule::exists('portfolio_listing_categories', 'key')->where('is_active', true),
            ],
            'zone' => ['nullable', 'string', 'max:120'],
            'pinned_home' => ['sometimes', 'boolean'],
            'pinned_home_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);
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

    protected function currentListingDisplayDate(string $locale): string
    {
        return Carbon::now()->locale($locale)->translatedFormat('j F Y');
    }

    protected function isImobiliareOfferUrl(string $url): bool
    {
        $host = (string) parse_url($url, PHP_URL_HOST);
        $path = (string) parse_url($url, PHP_URL_PATH);
        $host = Str::lower($host);

        return ($host === 'imobiliare.ro' || Str::endsWith($host, '.imobiliare.ro'))
            && Str::contains($path, '/oferta/');
    }

    /**
     * @return array{
     *   title: string|null,
     *   short_description: string|null,
     *   description: string|null,
     *   price: string|null,
     *   zone: string|null,
     *   listing_category: string|null,
     *   external_imobiliare_url: string,
     *   property_filters: list<array{property_filter_id:int,value:string}>
     * }
     */
    protected function extractImobiliarePayload(string $html, string $url): array
    {
        $plain = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8')) ?? '');
        $structuredText = $this->toStructuredText($html);

        $title = $this->extractMetaContent($html, 'property="og:title"');
        if (! $title) {
            $title = $this->extractTitleTag($html);
        }
        if ($title) {
            $title = trim(preg_replace('/\s*\|\s*Imobiliare\.ro.*$/iu', '', $title) ?? $title);
        }

        $metaDescription = $this->extractMetaContent($html, 'name="description"')
            ?? $this->extractMetaContent($html, 'property="og:description"');
        $fullDescription = $this->extractImobiliareDescriptionFromHtml($html)
            ?? $this->extractImobiliareDescriptionBlock($html);

        $price = $this->extractPriceValue($plain);
        $zone = $this->extractZoneValue($html, $plain);
        $listingCategory = $this->inferListingCategoryFromUrl($url);

        $propertyFilters = $this->extractPropertyFilterRows($html, $structuredText, $plain);

        return [
            'title' => $title ? Str::limit(trim($title), 255, '') : null,
            'short_description' => $metaDescription ? Str::limit(trim($metaDescription), 300, '') : null,
            'description' => $fullDescription ?? ($metaDescription ? trim($metaDescription) : null),
            'price' => $price,
            'zone' => $zone,
            'listing_category' => $listingCategory,
            'external_imobiliare_url' => $url,
            'property_filters' => $propertyFilters,
        ];
    }

    protected function extractMetaContent(string $html, string $attr): ?string
    {
        $pattern = '/<meta[^>]*'.$attr.'[^>]*content="([^"]+)"[^>]*>/iu';
        if (preg_match($pattern, $html, $matches) === 1) {
            return html_entity_decode(trim($matches[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return null;
    }

    protected function extractTitleTag(string $html): ?string
    {
        if (preg_match('/<title[^>]*>(.*?)<\/title>/isu', $html, $matches) === 1) {
            return html_entity_decode(trim($matches[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return null;
    }

    protected function extractImobiliareDescriptionFromHtml(string $html): ?string
    {
        if (! preg_match(
            '/id="truncatedDescription"[^>]*>([\s\S]*?)<\/div>/iu',
            $html,
            $matches,
        )) {
            return null;
        }

        $raw = trim($matches[1]);
        if ($raw === '') {
            return null;
        }

        $withBreaks = preg_replace('/<(br|\/p|\/li|\/h[1-6]|\/div)\b[^>]*>/iu', "\n", $raw) ?? $raw;
        $text = html_entity_decode(strip_tags($withBreaks), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+\n/u', "\n", $text) ?? $text;
        $text = preg_replace('/\n{3,}/u', "\n\n", $text) ?? $text;
        $text = trim($text);

        if ($text === '') {
            return null;
        }

        // Page HTML may contain the same block twice (noscript + visible).
        $length = mb_strlen($text);
        if ($length % 2 === 0) {
            $halfLength = (int) ($length / 2);
            $firstHalf = mb_substr($text, 0, $halfLength);
            if ($firstHalf.mb_substr($text, $halfLength) === $text) {
                $text = $firstHalf;
            }
        }

        return Str::limit($text, 8000, '');
    }

    protected function extractImobiliareDescriptionBlock(string $html): ?string
    {
        // Convert common block separators to line breaks before stripping tags.
        $withBreaks = preg_replace('/<(br|\/p|\/li|\/h[1-6]|\/div)\b[^>]*>/iu', "\n", $html) ?? $html;
        $text = html_entity_decode(strip_tags($withBreaks), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+\n/u', "\n", $text) ?? $text;
        $text = preg_replace('/\n{3,}/u', "\n\n", $text) ?? $text;

        if (! is_string($text) || trim($text) === '') {
            return null;
        }

        $pattern = '/Descriere\s+(?:cas[ăa]|apartament)\s*(.*?)\s*(Citește\s+mai\s+mult|Detalii\s+(?:cas[ăa]|apartament)|Detalii\s+despre\s+preț|Puncte\s+de\s+interes)/isu';
        if (preg_match($pattern, $text, $m) === 1) {
            $desc = trim($m[1]);
            $desc = preg_replace('/\n{3,}/u', "\n\n", $desc) ?? $desc;

            return $desc !== '' ? Str::limit($desc, 8000, '') : null;
        }

        return null;
    }

    protected function toStructuredText(string $html): string
    {
        $withBreaks = preg_replace('/<(br|\/p|\/li|\/h[1-6]|\/div|\/tr|\/td)\b[^>]*>/iu', "\n", $html) ?? $html;
        $text = html_entity_decode(strip_tags($withBreaks), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+\n/u', "\n", $text) ?? $text;
        $text = preg_replace('/\n{3,}/u', "\n\n", $text) ?? $text;

        return trim($text);
    }

    protected function extractPriceValue(string $plain): ?string
    {
        if (preg_match('/([0-9][0-9\.\s]{2,})\s*€/u', $plain, $matches) !== 1) {
            return null;
        }

        $raw = preg_replace('/[^\d]/', '', $matches[1]) ?? '';
        if ($raw === '') {
            return null;
        }

        return ltrim($raw, '0') === '' ? '0' : ltrim($raw, '0');
    }

    protected function extractZoneValue(string $html, string $plain): ?string
    {
        if (preg_match_all('/data-cy="listing-address"[\s\S]*?>\s*([^<]+?)\s*</iu', $html, $matches) !== false) {
            foreach ($matches[1] as $candidate) {
                $zone = trim(html_entity_decode($candidate, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                if ($zone !== '' && ! preg_match('/€/u', $zone)) {
                    return Str::limit($zone, 120, '');
                }
            }
        }

        if (preg_match_all(
            '/([A-Za-zăâîșțĂÂÎȘȚ][A-Za-zăâîșțĂÂÎȘȚ\s\-]{0,45},\s*Jude[tț]ul\s+[A-Za-zăâîșțĂÂÎȘȚ\s]{1,45})\s*-\s*Vezi\s+Hart[ăa]/iu',
            $plain,
            $matches,
            PREG_SET_ORDER,
        ) !== false) {
            foreach (array_reverse($matches) as $match) {
                $candidate = trim($match[1]);
                if ($candidate !== '' && ! preg_match('/€|\d[\d\.\s]{2,}/u', $candidate)) {
                    return Str::limit($candidate, 120, '');
                }
            }
        }

        return null;
    }

    /**
     * @return list<array{label:string,value:string}>
     */
    protected function extractSpecificationPairsFromHtml(string $html): array
    {
        if (! preg_match('/<section[^>]*listing-specifications-component[\s\S]*?<\/section>/iu', $html, $sectionMatch)) {
            return [];
        }

        $section = $sectionMatch[0];
        $pairs = [];

        if (preg_match_all(
            '/<span[^>]*class="[^"]*shrink-0[^"]*"[^>]*>\s*([^:<]+?):\s*<\/span>\s*<span[^>]*class="[^"]*text-right[^"]*"[^>]*>\s*([\s\S]*?)<\/span>/iu',
            $section,
            $matches,
            PREG_SET_ORDER,
        ) === false) {
            return [];
        }

        foreach ($matches as $match) {
            $label = trim(html_entity_decode(strip_tags($match[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $value = trim(html_entity_decode(strip_tags($match[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $value = trim(preg_replace('/\s+/u', ' ', $value) ?? $value);

            if ($label === '' || $value === '' || str_contains(mb_strtolower($label), 'id anun')) {
                continue;
            }

            $pairs[] = ['label' => $label, 'value' => $value];
        }

        return $pairs;
    }

    protected function extractImobiliareAmenitiesSummary(string $html): ?string
    {
        if (! preg_match('/<section[^>]*listing-amenities-simple-component[\s\S]*?<\/section>/iu', $html, $sectionMatch)) {
            return null;
        }

        $section = $sectionMatch[0];
        $groups = [];

        if (preg_match_all(
            '/<span[^>]*class="[^"]*text-title[^"]*"[^>]*>\s*([^<]+?)\s*<\/span>[\s\S]*?<div[^>]*class="[^"]*flex flex-wrap gap-3[^"]*"[^>]*>([\s\S]*?)<\/div>/iu',
            $section,
            $matches,
            PREG_SET_ORDER,
        ) === false || $matches === []) {
            return null;
        }

        foreach ($matches as $match) {
            $category = trim(html_entity_decode($match[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            if ($category === '' || preg_match('/^(utilități|utilitati)$/iu', $category)) {
                continue;
            }

            if (preg_match_all(
                '/<span[^>]*class="[^"]*text-content[^"]*"[^>]*>\s*([^<]+?)\s*<\/span>/iu',
                $match[2],
                $tags,
                PREG_SET_ORDER,
            ) === false) {
                continue;
            }

            $values = [];
            foreach ($tags as $tag) {
                $value = trim(html_entity_decode($tag[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                if ($value !== '') {
                    $values[] = $value;
                }
            }

            if ($values !== []) {
                $groups[] = $category.': '.implode(', ', $values);
            }
        }

        if ($groups === []) {
            return null;
        }

        $priority = [
            'Facilități imobil',
            'Utilități',
            'Internet',
            'Electrocasnice',
            'Pereți',
            'Podele',
            'Bucătărie',
        ];

        usort($groups, function (string $a, string $b) use ($priority): int {
            $labelA = Str::before($a, ':');
            $labelB = Str::before($b, ':');
            $posA = array_search($labelA, $priority, true);
            $posB = array_search($labelB, $priority, true);
            $posA = $posA === false ? 99 : $posA;
            $posB = $posB === false ? 99 : $posB;

            return $posA <=> $posB;
        });

        $summary = '';
        foreach ($groups as $group) {
            $candidate = $summary === '' ? $group : $summary.'; '.$group;
            if (mb_strlen($candidate) > 255) {
                break;
            }
            $summary = $candidate;
        }

        return $summary !== '' ? $summary : null;
    }

    protected function isPlausibleParkingValue(string $value): bool
    {
        $lower = mb_strtolower($value);

        if (str_contains($lower, 'aprox')) {
            return false;
        }

        if (preg_match('/\b\d+\s*m\b/u', $lower)) {
            return false;
        }

        if (preg_match('/parcare\s+(pentru|cu\s+plata)/iu', $lower)) {
            return false;
        }

        return true;
    }

    protected function inferListingCategoryFromUrl(string $url): ?string
    {
        $path = (string) parse_url($url, PHP_URL_PATH);
        $path = Str::lower($path);

        $deal = Str::contains($path, 'de-inchiriere') ? 'rent' : 'sale';

        $type = match (true) {
            Str::contains($path, 'apartament') => 'apartment',
            Str::contains($path, 'teren') => 'land',
            Str::contains($path, 'spatiu-comercial'), Str::contains($path, 'comercial') => 'commercial',
            Str::contains($path, 'industrial') => 'industrial',
            Str::contains($path, 'birou'), Str::contains($path, 'office') => 'office',
            Str::contains($path, 'casa'), Str::contains($path, 'house') => 'house',
            default => 'house',
        };

        $categoryKey = match ($type) {
            'apartment' => $deal === 'rent' ? 'apartment_rent' : 'apartment_sale',
            'land' => $deal === 'rent' ? null : 'land_sale',
            'office' => $deal === 'rent' ? null : 'office_sale',
            'commercial' => $deal === 'rent' ? 'commercial_rent' : 'commercial_sale',
            'industrial' => $deal === 'rent' ? 'industrial_rent' : 'industrial_sale',
            default => $deal === 'rent' ? 'house_rent' : 'case_sale',
        };

        if (! $categoryKey) {
            return null;
        }

        $exists = PortfolioListingCategory::query()
            ->where('key', $categoryKey)
            ->where('is_active', true)
            ->exists();

        return $exists ? $categoryKey : null;
    }

    /**
     * @return list<array{property_filter_id:int,value:string}>
     */
    protected function extractPropertyFilterRows(string $html, string $structuredText, string $plain): array
    {
        $filterIdByKey = PropertyFilter::query()
            ->active()
            ->pluck('id', 'key')
            ->mapWithKeys(fn ($id, $key) => [(string) $key => (int) $id])
            ->all();

        $rows = [];
        $seenFilterIds = [];
        $push = function (string $key, ?string $value) use (&$rows, &$seenFilterIds, $filterIdByKey): void {
            if ($value === null) {
                return;
            }
            $normalized = trim($value);
            if ($normalized === '') {
                return;
            }
            // Guard against accidental captures from CSS/JS blobs in page source.
            if (preg_match('/@font-face|<style|<script|\{.*\}/iu', $normalized) === 1) {
                return;
            }

            if (! isset($filterIdByKey[$key])) {
                return;
            }

            $filterId = (int) $filterIdByKey[$key];
            if ($filterId <= 0 || isset($seenFilterIds[$filterId])) {
                return;
            }

            $rows[] = [
                'property_filter_id' => $filterId,
                'value' => Str::limit($normalized, 255, ''),
            ];
            $seenFilterIds[$filterId] = true;
        };

        $rooms = null;
        if (preg_match('/Nr\.\s*cam\.?:\s*([0-9]+)/iu', $plain, $m) === 1) {
            $rooms = trim($m[1]);
        }
        $push('camere', $rooms);

        $usableArea = null;
        if (preg_match('/Sup\.\s*util[ăa]?:\s*([0-9\., ]+)\s*mp/iu', $plain, $m) === 1) {
            $usableArea = trim($m[1]).' mp';
        }
        $push('suprafata_utila', $usableArea);

        $landArea = null;
        if (preg_match('/Sup\.\s*teren:?\s*([0-9\., ]+)\s*mp/iu', $plain, $m) === 1) {
            $landArea = trim($m[1]).' mp';
        }
        $push('suprafata_teren', $landArea);

        $propertyType = null;
        if (preg_match('/Tip\s*prop\.?:\s*([^\n\r]{2,50})/iu', $plain, $m) === 1) {
            $propertyType = trim($m[1]);
        }
        $push('tip_imobil', $propertyType);

        $bathrooms = null;
        if (preg_match('/Nr\.\s*b[ăa]i:?\s*([0-9]+)/iu', $plain, $m) === 1) {
            $bathrooms = trim($m[1]);
        }
        $push('nr_bai', $bathrooms);

        $floor = null;
        if (preg_match('/Etaj:?\s*([A-Za-z0-9\-\/]+)/iu', $plain, $m) === 1) {
            $floor = trim($m[1]);
        } elseif (preg_match('/Regim\s+în[ăa]l[țt]ime:?\s*([A-Za-z0-9\-\/]+)/iu', $plain, $m) === 1) {
            $floor = trim($m[1]);
        }
        $push('etaj', $floor);

        $yearBuilt = null;
        if (preg_match('/Anul\s+construc[țt]iei:?\s*([0-9]{4})/iu', $plain, $m) === 1) {
            $yearBuilt = trim($m[1]);
        } elseif (preg_match('/propertyYear[^0-9]{0,20}([0-9]{4})/iu', $plain, $m) === 1) {
            // Fallback on some embedded JSON blobs from listing pages.
            $yearBuilt = trim($m[1]);
        }
        $push('anul_constructiei', $yearBuilt);

        $balconies = null;
        if (preg_match('/Nr\.\s*balcoane:?\s*([0-9]+)/iu', $plain, $m) === 1) {
            $balconies = trim($m[1]);
        }
        $push('nr_balcoane', $balconies);

        // Parking is extracted only from structured details to avoid
        // false matches from "puncte de interes" or CSS/source fragments.
        $push('locuri_parcare', null);

        $constructionStage = null;
        if (preg_match('/Stadiu\s+construc[țt]ie:?\s*([^\n\r]{2,80})/iu', $plain, $m) === 1) {
            $constructionStage = trim($m[1]);
        }
        $push('stadiu_constructie', $constructionStage);

        $payment = null;
        if (preg_match('/Modalitate\s+de\s+plat[ăa]:?\s*([^\n\r]{2,80})/iu', $plain, $m) === 1) {
            $payment = trim($m[1]);
        }
        $push('modalitate_plata', $payment);

        $amenitiesSummary = $this->extractImobiliareAmenitiesSummary($html);
        $push('dotari', $amenitiesSummary);

        foreach ($this->extractSpecificationPairsFromHtml($html) as $pair) {
            $mappedKey = $this->mapImobiliareLabelToPropertyFilterKey($pair['label']);
            if ($mappedKey === null) {
                continue;
            }
            $value = $pair['value'];
            if ($mappedKey === 'locuri_parcare' && ! $this->isPlausibleParkingValue($value)) {
                continue;
            }
            $push($mappedKey, $value);
        }

        foreach ($this->extractImobiliareDetailsPairs($structuredText) as $pair) {
            $label = $pair['label'];
            $value = $pair['value'];
            $mappedKey = $this->mapImobiliareLabelToPropertyFilterKey($label);
            if ($mappedKey === null) {
                continue;
            }
            $push($mappedKey, $value);
        }

        return $rows;
    }

    /**
     * @return list<array{label:string,value:string}>
     */
    protected function extractImobiliareDetailsPairs(string $structuredText): array
    {
        $block = '';
        if (preg_match('/Detalii\s+(?:cas[ăa]|apartament)\s*(.*?)\s*(?:Utilit[ăa][țt]i|Comision|Puncte\s+de\s+interes|Detalii\s+despre\s+preț)/isu', $structuredText, $m) === 1) {
            $block = trim($m[1]);
        }
        if ($block === '') {
            return [];
        }

        $pairs = [];
        $lines = array_values(array_filter(array_map('trim', explode("\n", $block))));

        for ($i = 0; $i < count($lines); $i++) {
            if (preg_match('/^(.{2,80}):$/u', $lines[$i], $labelMatch) !== 1) {
                continue;
            }

            $label = trim($labelMatch[1]);
            if (str_contains(mb_strtolower($label), 'id anun')) {
                continue;
            }

            $valueParts = [];
            for ($j = $i + 1; $j < count($lines); $j++) {
                if (preg_match('/^.{2,80}:$/u', $lines[$j]) === 1) {
                    break;
                }
                if (preg_match('/^(actualizat|utilități|utilitati|copiat)/iu', $lines[$j]) === 1) {
                    break;
                }
                $valueParts[] = $lines[$j];
            }

            if ($valueParts === []) {
                continue;
            }

            $pairs[] = [
                'label' => $label,
                'value' => implode(', ', $valueParts),
            ];
            $i += count($valueParts);
        }

        if ($pairs !== []) {
            return $pairs;
        }

        if (preg_match_all('/([A-ZĂÂÎȘȚa-zăâîșț\.\- ]{2,60}):\s*([^\n]{1,140})/u', $block, $matches, PREG_SET_ORDER) !== false) {
            foreach ($matches as $match) {
                $label = trim($match[1]);
                $value = trim($match[2]);
                if ($label === '' || $value === '') {
                    continue;
                }
                $pairs[] = ['label' => $label, 'value' => $value];
            }
        }

        return $pairs;
    }

    protected function mapImobiliareLabelToPropertyFilterKey(string $label): ?string
    {
        $normalized = Str::lower(trim($label));
        $normalized = str_replace(['ă', 'â', 'î', 'ș', 'ş', 'ț', 'ţ', '.'], ['a', 'a', 'i', 's', 's', 't', 't', ''], $normalized);
        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;

        return match ($normalized) {
            'nr cam', 'nr camere', 'camere' => 'camere',
            'sup utila', 'suprafata utila' => 'suprafata_utila',
            'sup teren', 'suprafata teren' => 'suprafata_teren',
            'tip prop', 'tip proprietate', 'tip imobil' => 'tip_imobil',
            'nr bai', 'bai' => 'nr_bai',
            'etaj', 'regim inaltime' => 'etaj',
            'anul constructiei', 'an constructie' => 'anul_constructiei',
            'nr balcoane' => 'nr_balcoane',
            'parcare', 'locuri de parcare' => 'locuri_parcare',
            'stadiu constructie' => 'stadiu_constructie',
            'modalitate de plata' => 'modalitate_plata',
            'nr bucatarii' => 'nr_bucatarii',
            'nr fronturi stradale' => 'nr_fronturi_stradale',
            'front stradal' => 'front_stradal',
            'compartimentare' => 'tip_compartimentare',
            'confort', 'nivel confort' => 'nivel_confort',
            'mobilat' => 'tip_finisaj',
            default => null,
        };
    }
}
