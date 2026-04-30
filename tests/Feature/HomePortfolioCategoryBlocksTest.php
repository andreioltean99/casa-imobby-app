<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePortfolioCategoryBlocksTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_orders_pinned_listings_before_others_within_a_category(): void
    {
        $secondPinned = PortfolioItem::factory()->create([
            'slug' => 'case-b',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'case_sale',
            'pinned_home' => true,
            'pinned_home_order' => 10,
            'sort_order' => 1,
        ]);

        $firstPinned = PortfolioItem::factory()->create([
            'slug' => 'case-a',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'case_sale',
            'pinned_home' => true,
            'pinned_home_order' => 1,
            'sort_order' => 99,
        ]);

        $unpinned = PortfolioItem::factory()->create([
            'slug' => 'case-c',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'case_sale',
            'pinned_home' => false,
            'pinned_home_order' => null,
            'sort_order' => 0,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->has('portfolioCategoryBlocks', 1)
                ->where('portfolioCategoryBlocks.0.category', 'case_sale')
                ->where('portfolioCategoryBlocks.0.items.0.id', $firstPinned->id)
                ->where('portfolioCategoryBlocks.0.items.1.id', $secondPinned->id)
                ->where('portfolioCategoryBlocks.0.items.2.id', $unpinned->id));
    }

    public function test_home_omits_categories_with_no_published_listings(): void
    {
        PortfolioItem::factory()->create([
            'slug' => 'only-land',
            'locale' => 'ro',
            'is_published' => true,
            'listing_category' => 'land_sale',
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/home')
                ->has('portfolioCategoryBlocks', 1)
                ->where('portfolioCategoryBlocks.0.category', 'land_sale'));
    }
}
