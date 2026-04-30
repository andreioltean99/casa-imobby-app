<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioIndexCategoryFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_portfolio_index_sets_active_category_and_filters_items(): void
    {
        $match = PortfolioItem::factory()->create([
            'slug' => 'case-one',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'case_sale',
        ]);

        PortfolioItem::factory()->create([
            'slug' => 'land-one',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'land_sale',
        ]);

        $this->get(route('portfolio', ['category' => 'case_sale']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/portfolio')
                ->where('activeListingCategory', 'case_sale')
                ->has('portfolioItems', 1)
                ->where('portfolioItems.0.id', $match->id));
    }

    public function test_legacy_portfolio_path_redirects_to_proprietati(): void
    {
        $this->get('/portfolio')->assertRedirect('/proprietati');
    }

    public function test_portfolio_index_ignores_invalid_category_query(): void
    {
        PortfolioItem::factory()->create([
            'slug' => 'any-one',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'case_sale',
        ]);

        $this->get(route('portfolio', ['category' => 'not-a-real-category']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('activeListingCategory', null)
                ->has('portfolioItems', 1));
    }
}
