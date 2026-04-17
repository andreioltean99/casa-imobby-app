<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Principle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrincipleDashboardController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboard/principles-create');
    }

    public function store(Request $request)
    {
        $locale = app()->getLocale();

        if ($request->sort_order === '') {
            $request->merge(['sort_order' => null]);
        }
        $data = $request->validate([
            'text' => ['required', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['locale'] = $locale;
        Principle::create($data);

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'Principle added.');
    }

    public function edit(Principle $principle)
    {
        if ($principle->locale !== app()->getLocale()) {
            $localized = Principle::query()
                ->where('text', $principle->text)
                ->where('locale', app()->getLocale())
                ->first();

            if ($localized) {
                return redirect()
                    ->route('dashboard.principles.edit', $localized)
                    ->with('status', 'Switched to the selected language.');
            }

            return redirect()
                ->route('dashboard.about.index')
                ->with('status', 'No principle translation exists in the selected language.');
        }

        return Inertia::render('dashboard/principles-edit', [
            'principle' => $principle,
        ]);
    }

    public function update(Request $request, Principle $principle)
    {
        if ($principle->locale !== app()->getLocale()) {
            abort(404);
        }

        if ($request->sort_order === '') {
            $request->merge(['sort_order' => null]);
        }
        $data = $request->validate([
            'text' => ['required', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['locale'] = app()->getLocale();
        $principle->update($data);

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'Principle updated.');
    }

    public function destroy(Principle $principle)
    {
        if ($principle->locale !== app()->getLocale()) {
            abort(404);
        }

        $principle->delete();

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'Principle deleted.');
    }
}
