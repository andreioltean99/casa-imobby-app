<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use App\Models\PortfolioListingCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioListingCategoryDashboardController extends Controller
{
    public function index()
    {
        $categories = PortfolioListingCategory::query()
            ->ordered()
            ->get(['id', 'name_en', 'name_ro', 'sort_order', 'is_active']);

        return Inertia::render('dashboard/listing-categories', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/listing-categories-create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en' => ['nullable', 'string', 'max:255'],
            'name_ro' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['name_en'] = trim((string) ($data['name_en'] ?? ''));
        $data['key'] = PortfolioListingCategory::generateUniqueKey();
        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        PortfolioListingCategory::query()->create($data);

        return redirect()
            ->route('dashboard.listing-categories.index')
            ->with('status', 'Category created.');
    }

    public function edit(PortfolioListingCategory $listingCategory)
    {
        return Inertia::render('dashboard/listing-categories-edit', [
            'listingCategory' => $listingCategory->only([
                'id',
                'name_en',
                'name_ro',
                'sort_order',
                'is_active',
            ]),
        ]);
    }

    public function update(Request $request, PortfolioListingCategory $listingCategory)
    {
        $data = $request->validate([
            'name_en' => ['nullable', 'string', 'max:255'],
            'name_ro' => ['required', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:999999'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data['name_en'] = trim((string) ($data['name_en'] ?? ''));
        $data['is_active'] = $request->boolean('is_active');

        $listingCategory->update($data);

        return redirect()
            ->route('dashboard.listing-categories.index')
            ->with('status', 'Category updated.');
    }

    public function destroy(PortfolioListingCategory $listingCategory)
    {
        if (PortfolioItem::query()->where('listing_category', $listingCategory->key)->exists()) {
            return redirect()
                ->route('dashboard.listing-categories.index')
                ->withErrors(['delete' => 'Cannot delete: one or more listings use this category. Reassign them first.']);
        }

        $listingCategory->delete();

        return redirect()
            ->route('dashboard.listing-categories.index')
            ->with('status', 'Category deleted.');
    }
}
