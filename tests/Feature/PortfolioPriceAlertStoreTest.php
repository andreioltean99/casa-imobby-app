<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioPriceAlertStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_subscribe_with_email_for_published_listing(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'alert-listing',
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $response = $this->post(route('portfolio.price-alerts.store', ['identifier' => $item->slug]), [
            'email' => 'Buyer@Example.com',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('portfolio_price_alert_subscriptions', [
            'portfolio_item_id' => $item->id,
            'email' => 'buyer@example.com',
        ]);

        $this->assertDatabaseCount('portfolio_price_alert_subscriptions', 1);
    }

    public function test_second_submit_same_email_updates_row_instead_of_duplicating(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'dedupe-listing',
            'locale' => 'ro',
            'is_published' => true,
            'price' => 100,
        ]);

        $this->post(route('portfolio.price-alerts.store', ['identifier' => $item->slug]), [
            'email' => 'same@example.com',
        ])->assertRedirect();

        $item->update(['price' => 95]);

        $this->post(route('portfolio.price-alerts.store', ['identifier' => $item->slug]), [
            'email' => 'same@example.com',
        ])->assertRedirect();

        $this->assertDatabaseCount('portfolio_price_alert_subscriptions', 1);
        $this->assertDatabaseHas('portfolio_price_alert_subscriptions', [
            'portfolio_item_id' => $item->id,
            'email' => 'same@example.com',
            'reference_price' => '95.00',
        ]);
    }

    public function test_subscribe_returns_404_for_unknown_listing(): void
    {
        $this->post(route('portfolio.price-alerts.store', ['identifier' => 'missing-slug']), [
            'email' => 'buyer@example.com',
        ])->assertNotFound();
    }
}
