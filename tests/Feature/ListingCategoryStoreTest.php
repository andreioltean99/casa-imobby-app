<?php

namespace Tests\Feature;

use App\Models\PortfolioListingCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingCategoryStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_listing_category_without_key_field(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('dashboard.listing-categories.store'), [
            'name_en' => 'Villas',
            'name_ro' => 'Vile',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('dashboard.listing-categories.index'));

        $category = PortfolioListingCategory::query()->where('name_en', 'Villas')->first();
        $this->assertNotNull($category);
        $this->assertMatchesRegularExpression('/^c_[a-z0-9]{12}$/', $category->key);
        $this->assertSame('Vile', $category->name_ro);
    }

    public function test_admin_can_create_listing_category_with_romanian_name_only(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('dashboard.listing-categories.store'), [
            'name_ro' => 'Garsoniere',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('dashboard.listing-categories.index'));
        $response->assertSessionHasNoErrors();

        $category = PortfolioListingCategory::query()->where('name_ro', 'Garsoniere')->first();
        $this->assertNotNull($category);
        $this->assertSame('', $category->name_en);
        $this->assertSame('Garsoniere', $category->nameForLocale('en'));
    }
}
