<?php

namespace Tests\Feature;

use App\Models\LeadSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadOfferSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_lead_offer_submission_requires_terms(): void
    {
        $response = $this->from(route('home'))->post(route('lead-offers.store'), [
            'full_name' => 'Ion Popescu',
            'phone' => '+40700000000',
            'email' => 'ion@example.com',
            'budget' => '80.000',
            'newsletter' => false,
            'terms_accepted' => false,
        ]);

        $response->assertSessionHasErrors('terms_accepted');
        $this->assertSame(0, LeadSubmission::count());
    }

    public function test_lead_offer_submission_stores_row(): void
    {
        $response = $this->from(route('home'))->post(route('lead-offers.store'), [
            'full_name' => 'Ion Popescu',
            'phone' => '+40700000000',
            'email' => 'ion@example.com',
            'budget' => '80.000',
            'newsletter' => true,
            'terms_accepted' => true,
        ]);

        $response->assertRedirect(route('home'));
        $this->assertSame(1, LeadSubmission::count());
        $this->assertDatabaseHas('lead_submissions', [
            'email' => 'ion@example.com',
            'full_name' => 'Ion Popescu',
            'newsletter' => 1,
            'terms_accepted' => 1,
        ]);
    }
}
