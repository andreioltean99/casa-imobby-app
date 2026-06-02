<?php

namespace Tests\Feature;

use App\Models\PropertyFilter;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioFormOptionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_fetch_portfolio_form_options_as_json(): void
    {
        $user = User::factory()->create();

        PropertyFilter::query()->create([
            'key' => 'pf_testrooms002',
            'name_ro' => 'Camere',
            'name_en' => 'Rooms',
            'is_active' => true,
            'is_searchable' => true,
        ]);

        $response = $this->actingAs($user)->getJson(route('dashboard.portfolio.form-options'));

        $response->assertOk();
        $response->assertJsonStructure([
            'propertyFilterOptions' => [['id', 'key', 'label', 'is_searchable', 'is_active']],
            'listingCategoryOptions' => [['value', 'label', 'is_active']],
        ]);
        $response->assertJsonFragment(['label' => 'Camere']);
    }

    public function test_guest_cannot_fetch_portfolio_form_options(): void
    {
        $this->getJson(route('dashboard.portfolio.form-options'))->assertUnauthorized();
    }
}
