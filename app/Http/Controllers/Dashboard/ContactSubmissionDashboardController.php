<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactSubmissionDashboardController extends Controller
{
    public function index(): Response
    {
        $submissions = ContactSubmission::query()
            ->orderByDesc('created_at')
            ->get([
                'id',
                'first_name',
                'last_name',
                'email',
                'company',
                'source',
                'read_at',
                'created_at',
            ]);

        return Inertia::render('dashboard/contact-submissions', [
            'submissions' => $submissions,
        ]);
    }

    public function show(Request $request, ContactSubmission $contactSubmission): Response
    {
        if ($contactSubmission->read_at === null && ! $request->boolean('keep_unread')) {
            $contactSubmission->update(['read_at' => now()]);
        }

        return Inertia::render('dashboard/contact-submissions-show', [
            'submission' => $contactSubmission->only([
                'id',
                'first_name',
                'last_name',
                'email',
                'message',
                'source',
                'read_at',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function markUnread(ContactSubmission $contactSubmission): RedirectResponse
    {
        $contactSubmission->update(['read_at' => null]);

        return redirect()
            ->route('dashboard.contact-submissions.show', [
                'contactSubmission' => $contactSubmission->id,
                'keep_unread' => 1,
            ])
            ->with('status', 'Marked as unread.');
    }

    public function destroy(ContactSubmission $contactSubmission): RedirectResponse
    {
        $contactSubmission->delete();

        return redirect()
            ->route('dashboard.contact-submissions.index')
            ->with('status', 'Message deleted.');
    }
}
