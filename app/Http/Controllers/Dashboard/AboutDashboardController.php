<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\AboutItem;
use App\Models\Principle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutDashboardController extends Controller
{
    public function index()
    {
        $locale = app()->getLocale();

        $about = About::where('locale', $locale)->first();
        $aboutItems = AboutItem::where('locale', $locale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get(['id', 'label', 'text', 'sort_order']);
        $principles = Principle::where('locale', $locale)
            ->orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('id')
            ->get(['id', 'text', 'sort_order']);

        return Inertia::render('dashboard/about', [
            'about' => $about,
            'aboutItems' => $aboutItems,
            'principles' => $principles,
        ]);
    }

    public function update(Request $request)
    {
        $locale = app()->getLocale();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'principles_heading' => ['nullable', 'string', 'max:255'],
        ]);

        $about = About::firstOrCreate(['locale' => $locale], [
            'title' => 'About Casa Imobby',
            'body' => '',
            'principles_heading' => 'Our principles',
        ]);

        $about->update($data);

        return redirect()
            ->route('dashboard.about.index')
            ->with('status', 'About section updated.');
    }
}
