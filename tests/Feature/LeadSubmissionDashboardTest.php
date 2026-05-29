<?php

namespace Tests\Feature;

use App\Models\LeadSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadSubmissionDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_lead_submissions(): void
    {
        $this->get(route('dashboard.lead-submissions.index'))->assertRedirect();
    }

    public function test_authenticated_user_can_list_and_view_lead_submissions(): void
    {
        $user = User::factory()->create();
        $submission = LeadSubmission::create([
            'full_name' => 'Ion Popescu',
            'phone' => '0700000000',
            'email' => 'ion@example.com',
            'budget' => '100.000',
            'newsletter' => false,
            'terms_accepted' => true,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard.lead-submissions.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard/lead-submissions')
                ->has('submissions', 1)
            );

        $this->actingAs($user)
            ->get(route('dashboard.lead-submissions.show', $submission))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('dashboard/lead-submissions-show'));

        $this->assertNotNull($submission->fresh()->read_at);
    }

    public function test_authenticated_user_can_delete_lead_submission(): void
    {
        $user = User::factory()->create();
        $submission = LeadSubmission::create([
            'full_name' => 'Ion Popescu',
            'phone' => '0700000000',
            'email' => 'ion@example.com',
            'budget' => null,
            'newsletter' => false,
            'terms_accepted' => true,
        ]);

        $this->actingAs($user)
            ->delete(route('dashboard.lead-submissions.destroy', $submission))
            ->assertRedirect(route('dashboard.lead-submissions.index'));

        $this->assertSame(0, LeadSubmission::count());
    }
}
