<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_submission_requires_core_fields(): void
    {
        $response = $this->from(route('contact'))->post(route('contact-messages.store'), []);

        $response->assertSessionHasErrors(['first_name', 'last_name', 'email', 'message']);
        $this->assertSame(0, ContactSubmission::count());
    }

    public function test_contact_submission_stores_row(): void
    {
        $response = $this->from(route('contact'))->post(route('contact-messages.store'), [
            'first_name' => 'Ana',
            'last_name' => 'Ionescu',
            'company' => 'Imob SRL',
            'email' => 'ana@example.com',
            'message' => 'Caut apartament în Cluj.',
            'source' => 'contact',
        ]);

        $response->assertRedirect(route('contact'));
        $response->assertSessionHas('contact_submitted', true);
        $this->assertSame(1, ContactSubmission::count());
        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'ana@example.com',
            'source' => 'contact',
        ]);
    }
}
