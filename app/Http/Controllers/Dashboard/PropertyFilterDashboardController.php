<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PropertyFilter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PropertyFilterDashboardController extends Controller
{
    public function index()
    {
        $filters = PropertyFilter::query()
            ->ordered()
            ->get(['id', 'key', 'name_en', 'name_ro', 'is_active', 'is_searchable', 'sort_order']);

        return Inertia::render('dashboard/property-filters', [
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/property-filters-create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'key' => [
                'required',
                'string',
                'max:64',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('property_filters', 'key'),
            ],
            'name_en' => ['required', 'string', 'max:255'],
            'name_ro' => ['required', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'is_searchable' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999999'],
        ]);

        $data['is_active'] = $request->boolean('is_active');
        $data['is_searchable'] = $request->boolean('is_searchable');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        PropertyFilter::query()->create($data);

        return redirect()
            ->route('dashboard.property-characteristics.index')
            ->with('status', 'Property characteristic created.');
    }

    public function edit(PropertyFilter $propertyFilter)
    {
        return Inertia::render('dashboard/property-filters-edit', [
            'propertyFilter' => $propertyFilter,
        ]);
    }

    public function update(Request $request, PropertyFilter $propertyFilter)
    {
        $data = $request->validate([
            'name_en' => ['required', 'string', 'max:255'],
            'name_ro' => ['required', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'is_searchable' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999999'],
        ]);

        $data['is_active'] = $request->boolean('is_active');
        $data['is_searchable'] = $request->boolean('is_searchable');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $propertyFilter->update($data);

        return redirect()
            ->route('dashboard.property-characteristics.index')
            ->with('status', 'Property characteristic updated.');
    }

    public function destroy(PropertyFilter $propertyFilter)
    {
        if ($propertyFilter->values()->exists()) {
            return redirect()
                ->route('dashboard.property-characteristics.index')
                ->withErrors(['delete' => 'Cannot delete: one or more listings use this filter.']);
        }

        $propertyFilter->delete();

        return redirect()
            ->route('dashboard.property-characteristics.index')
            ->with('status', 'Property characteristic deleted.');
    }
}
