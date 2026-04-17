<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\LandingHeroSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingHeroDashboardController extends Controller
{
    public function edit()
    {
        $locale = app()->getLocale();
        $websiteTranslations = trans('website');
        $heroTranslations = $websiteTranslations['hero'] ?? [];

        $defaults = [
            'eyebrow' => $heroTranslations['eyebrow'] ?? 'Real estate with confidence',
            'title' => $heroTranslations['title'] ?? 'Find the home or investment that fits your plans.',
            'body' => $heroTranslations['body'] ?? 'Casa Imobby is a Romanian real estate agency guiding clients through buying, selling and renting — from first viewing to signing, with clear advice at every step.',
            'primary_cta' => $heroTranslations['primary_cta'] ?? 'Get in touch',
            'secondary_cta' => $heroTranslations['secondary_cta'] ?? 'Request offer',

            'end_to_end_heading' => $heroTranslations['end_to_end_heading'] ?? 'How we work with you',

            'step1_title' => $heroTranslations['step1_title'] ?? 'Brief & market context',
            'step1_body' => $heroTranslations['step1_body'] ?? '',
            'step2_title' => $heroTranslations['step2_title'] ?? 'Shortlist & viewings',
            'step2_body' => $heroTranslations['step2_body'] ?? '',
            'step3_title' => $heroTranslations['step3_title'] ?? 'Offer to closing',
            'step3_body' => $heroTranslations['step3_body'] ?? '',
        ];

        $page = LandingHeroSettings::query()->firstOrCreate(
            ['locale' => $locale],
            $defaults
        );

        return Inertia::render('dashboard/landing-hero', [
            'page' => $page,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'eyebrow' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:600'],
            'body' => ['required', 'string'],
            'primary_cta' => ['required', 'string', 'max:255'],
            'secondary_cta' => ['required', 'string', 'max:255'],

            'end_to_end_heading' => ['required', 'string', 'max:255'],

            'step1_title' => ['required', 'string', 'max:255'],
            'step1_body' => ['required', 'string'],
            'step2_title' => ['required', 'string', 'max:255'],
            'step2_body' => ['required', 'string'],
            'step3_title' => ['required', 'string', 'max:255'],
            'step3_body' => ['required', 'string'],
        ]);

        $locale = app()->getLocale();
        $hero = LandingHeroSettings::query()->firstOrCreate(
            ['locale' => $locale],
            $data
        );

        $hero->update($data);

        return redirect()
            ->route('dashboard.landing-hero.edit')
            ->with('status', 'Landing hero updated.');
    }
}
