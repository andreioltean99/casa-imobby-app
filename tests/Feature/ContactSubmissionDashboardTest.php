<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactSubmissionDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_contact_messages(): void
    {
        $this->get(route('dashboard.contact-submissions.index'))->assertRedirect();
    }

    public function test_authenticated_user_can_list_and_view_contact_messages(): void
    {
        $user = User::factory()->create();
        $submission = ContactSubmission::create([
            'first_name' => 'Ana',
            'last_name' => 'Ionescu',
            'company' => null,
            'email' => 'ana@example.com',
            'message' => 'Salut!',
            'source' => 'home',
        ]);

        $this->actingAs($user)
            ->get(route('dashboard.contact-submissions.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard/contact-submissions')
                ->has('submissions', 1)
            );

        $this->actingAs($user)
            ->get(route('dashboard.contact-submissions.show', $submission))
            ->assertOk();

        $this->assertNotNull($submission->fresh()->read_at);
    }
}
