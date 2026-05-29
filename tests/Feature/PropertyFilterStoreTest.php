<?php

namespace Tests\Feature;

use App\Models\PropertyFilter;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyFilterStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_property_filter_without_key_field(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('dashboard.property-characteristics.store'), [
            'name_ro' => 'Camere',
            'is_active' => true,
            'is_searchable' => true,
        ]);

        $response->assertRedirect(route('dashboard.property-characteristics.index'));
        $response->assertSessionHasNoErrors();

        $filter = PropertyFilter::query()->where('name_ro', 'Camere')->first();
        $this->assertNotNull($filter);
        $this->assertMatchesRegularExpression('/^pf_[a-z0-9]{12}$/', $filter->key);
    }
}
