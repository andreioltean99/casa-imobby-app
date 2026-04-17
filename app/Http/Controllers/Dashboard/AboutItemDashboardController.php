<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AboutItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutItemDashboardController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboard/about-items-create');
    }

    public function store(Request $request)
    {
        $locale = app()->getLocale();

        if ($request->sort_order === '') {
            $request->merge(['sort_order' => null]);
        }
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'text' => ['required', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['locale'] = $locale;
        AboutItem::create($data);

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'Key point added.');
    }

    public function edit(AboutItem $aboutItem)
    {
        if ($aboutItem->locale !== app()->getLocale()) {
            $localized = AboutItem::query()
                ->where('label', $aboutItem->label)
                ->where('locale', app()->getLocale())
                ->first();

            // Fallback by text when labels are edited differently between locales.
            if (! $localized) {
                $localized = AboutItem::query()
                    ->where('text', $aboutItem->text)
                    ->where('locale', app()->getLocale())
                    ->first();
            }

            if ($localized) {
                return redirect()
                    ->route('dashboard.about-items.edit', $localized)
                    ->with('status', 'Switched to the selected language.');
            }

            return redirect()
                ->route('dashboard.about.index')
                ->with('status', 'No key point translation exists in the selected language.');
        }

        return Inertia::render('dashboard/about-items-edit', [
            'aboutItem' => $aboutItem,
        ]);
    }

    public function update(Request $request, AboutItem $aboutItem)
    {
        if ($aboutItem->locale !== app()->getLocale()) {
            abort(404);
        }

        if ($request->sort_order === '') {
            $request->merge(['sort_order' => null]);
        }
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'text' => ['required', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['locale'] = app()->getLocale();
        $aboutItem->update($data);

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'Key point updated.');
    }

    public function destroy(AboutItem $aboutItem)
    {
        if ($aboutItem->locale !== app()->getLocale()) {
            abort(404);
        }

        $aboutItem->delete();

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'Key point deleted.');
    }
}
