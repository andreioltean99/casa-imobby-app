<?php

namespace App\Http\Controllers;

use App\Models\LeadSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LeadOfferSubmissionController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email', 'max:255'],
            'budget' => ['nullable', 'string', 'max:120'],
            'newsletter' => ['sometimes', 'boolean'],
            'terms_accepted' => ['accepted'],
        ]);

        LeadSubmission::create([
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'budget' => $validated['budget'] ?? null,
            'newsletter' => (bool) ($validated['newsletter'] ?? false),
            'terms_accepted' => true,
        ]);

        return back()->with('lead_offer_submitted', true);
    }
}
