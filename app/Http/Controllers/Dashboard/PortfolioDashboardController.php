<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\PortfolioItemImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PortfolioDashboardController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        $items = PortfolioItem::orderByRaw('COALESCE(sort_order, 999999)')
            ->where('locale', $locale)
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
                'is_published',
                'sort_order',
            ]);

        return Inertia::render('dashboard/portfolio', [
            'portfolioItems' => $items,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/portfolio-create');
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

        $portfolioItem->load(['gallery' => fn ($q) => $q->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id')]);

        return Inertia::render('dashboard/portfolio-edit', [
            'portfolioItem' => $portfolioItem,
        ]);
    }

    public function store(Request $request)
    {
        $locale = app()->getLocale();
        $data = $this->validatedData($request);
        $data['slug'] = $this->uniqueSlug(Str::slug($data['title']), $locale);
        $data['locale'] = $locale;
        $data['listing_specs'] = $this->parseListingSpecsJson($request->input('listing_specs_json'));
        $data['external_listing_ref'] = $this->nullableString($data['external_listing_ref'] ?? null);
        unset($data['listing_specs_json']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('portfolio', 'public');
        }

        if ($request->hasFile('listing_pdf')) {
            $data['listing_pdf_path'] = $request->file('listing_pdf')->store('portfolio/pdfs', 'public');
        }

        $portfolioItem = PortfolioItem::create($data);

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

        $data = $this->validatedData($request);
        if (isset($data['title']) && $portfolioItem->title !== $data['title']) {
            $data['slug'] = $this->uniqueSlug(Str::slug($data['title']), $locale, $portfolioItem->id);
        }
        $data['locale'] = $locale;
        $data['listing_specs'] = $this->parseListingSpecsJson($request->input('listing_specs_json'));
        $data['external_listing_ref'] = $this->nullableString($data['external_listing_ref'] ?? null);
        unset($data['listing_specs_json']);

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

        $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        $path = $request->file('image')->store('portfolio/gallery', 'public');
        $maxOrder = $portfolioItem->gallery()->max('sort_order') ?? -1;
        $portfolioItem->gallery()->create([
            'image_path' => $path,
            'sort_order' => $maxOrder + 1,
        ]);

        return redirect()
            ->route('dashboard.portfolio.edit', $portfolioItem)
            ->with('status', 'Gallery image added.');
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
            'external_listing_ref' => ['nullable', 'string', 'max:120'],
            'listing_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:15360'],
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
}
