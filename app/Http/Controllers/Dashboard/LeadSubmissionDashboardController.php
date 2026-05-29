<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\LeadSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadSubmissionDashboardController extends Controller
{
    public function index(): Response
    {
        $submissions = LeadSubmission::query()
            ->orderByDesc('created_at')
            ->get([
                'id',
                'full_name',
                'email',
                'phone',
                'budget',
                'newsletter',
                'read_at',
                'created_at',
            ]);

        return Inertia::render('dashboard/lead-submissions', [
            'submissions' => $submissions,
        ]);
    }

    public function show(Request $request, LeadSubmission $leadSubmission): Response
    {
        if ($leadSubmission->read_at === null && ! $request->boolean('keep_unread')) {
            $leadSubmission->update(['read_at' => now()]);
        }

        return Inertia::render('dashboard/lead-submissions-show', [
            'submission' => $leadSubmission->only([
                'id',
                'full_name',
                'phone',
                'email',
                'budget',
                'newsletter',
                'terms_accepted',
                'read_at',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function markUnread(LeadSubmission $leadSubmission): RedirectResponse
    {
        $leadSubmission->update(['read_at' => null]);

        return redirect()
            ->route('dashboard.lead-submissions.show', [
                'leadSubmission' => $leadSubmission->id,
                'keep_unread' => 1,
            ])
            ->with('status', 'Marked as unread.');
    }

    public function destroy(LeadSubmission $leadSubmission): RedirectResponse
    {
        $leadSubmission->delete();

        return redirect()
            ->route('dashboard.lead-submissions.index')
            ->with('status', 'Submission deleted.');
    }
}
