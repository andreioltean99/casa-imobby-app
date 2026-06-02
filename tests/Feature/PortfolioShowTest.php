<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use App\Models\PropertyFilter;
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

        $response->assertRedirect(route('portfolio.show', ['slug' => $item->publicUrlSegment()]));
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

    public function test_portfolio_show_includes_property_characteristics_on_inertia_props(): void
    {
        $filter = PropertyFilter::query()->create([
            'key' => 'pf_testrooms001',
            'name_ro' => 'Nr. camere',
            'name_en' => 'Rooms',
            'is_active' => true,
            'is_searchable' => false,
        ]);

        $item = PortfolioItem::factory()->create([
            'slug' => 'specs-unit',
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $item->propertyFilterValues()->create([
            'property_filter_id' => $filter->id,
            'value' => '2',
            'sort_order' => 0,
        ]);

        $this->get(route('portfolio.show', ['slug' => $item->slug]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/portfolio-project')
                ->where('portfolioItem.property_filter_values.0.value', '2')
                ->where('portfolioItem.property_filter_values.0.property_filter.name_ro', 'Nr. camere')
            );
    }

    public function test_portfolio_show_includes_external_portal_urls_on_inertia_props(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'portals-unit',
            'locale' => 'ro',
            'is_published' => true,
            'external_storia_url' => 'https://www.storia.ro/oferta/example',
            'external_imobiliare_url' => 'https://www.imobiliare.ro/oferta/example',
            'external_olx_url' => 'https://www.olx.ro/d/oferta/example',
        ]);

        $this->get(route('portfolio.show', ['slug' => $item->slug]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/portfolio-project')
                ->where('portfolioItem.external_storia_url', 'https://www.storia.ro/oferta/example')
                ->where('portfolioItem.external_imobiliare_url', 'https://www.imobiliare.ro/oferta/example')
                ->where('portfolioItem.external_olx_url', 'https://www.olx.ro/d/oferta/example'));
    }
}
