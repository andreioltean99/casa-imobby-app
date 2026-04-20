<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_portfolio_show_resolves_published_item_by_numeric_id(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'demo-unit',
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $response = $this->get(route('portfolio.show', ['slug' => (string) $item->id]));

        $response->assertOk();
    }

    public function test_portfolio_show_returns_404_when_item_is_unpublished(): void
    {
        $item = PortfolioItem::factory()->unpublished()->create([
            'slug' => 'draft-unit',
            'locale' => 'ro',
        ]);

        $response = $this->get(route('portfolio.show', ['slug' => (string) $item->id]));

        $response->assertNotFound();
    }

    public function test_portfolio_show_includes_listing_specs_on_inertia_props(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'specs-unit',
            'locale' => 'ro',
            'is_published' => true,
            'listing_specs' => [
                ['label' => 'Nr. camere', 'value' => '2'],
            ],
        ]);

        $this->get(route('portfolio.show', ['slug' => $item->slug]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/portfolio-project')
                ->where('portfolioItem.listing_specs.0.label', 'Nr. camere')
                ->where('portfolioItem.listing_specs.0.value', '2'));
    }
}
