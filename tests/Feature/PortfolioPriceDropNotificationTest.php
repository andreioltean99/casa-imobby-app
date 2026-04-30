<?php

namespace Tests\Feature;

use App\Mail\PortfolioPriceDroppedNotification;
use App\Models\PortfolioItem;
use App\Models\PortfolioPriceAlertSubscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PortfolioPriceDropNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscribers_receive_email_when_price_drops_and_subscriptions_are_cleared(): void
    {
        Mail::fake();

        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'price' => 100,
            'is_published' => true,
        ]);

        PortfolioPriceAlertSubscription::query()->create([
            'portfolio_item_id' => $item->id,
            'email' => 'buyer@example.com',
        ]);

        PortfolioPriceAlertSubscription::notifySubscribersIfPriceDropped($item->fresh(), '100', '90');

        Mail::assertSent(PortfolioPriceDroppedNotification::class, function (PortfolioPriceDroppedNotification $mail) {
            return abs($mail->oldPrice - 100) < 0.01 && abs($mail->newPrice - 90) < 0.01;
        });

        $this->assertDatabaseHas('portfolio_price_alert_subscriptions', [
            'portfolio_item_id' => $item->id,
            'email' => 'buyer@example.com',
            'reference_price' => '90.00',
        ]);
    }

    public function test_no_email_when_price_increases(): void
    {
        Mail::fake();

        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'price' => 100,
            'is_published' => true,
        ]);

        PortfolioPriceAlertSubscription::query()->create([
            'portfolio_item_id' => $item->id,
            'email' => 'buyer@example.com',
        ]);

        PortfolioPriceAlertSubscription::notifySubscribersIfPriceDropped($item->fresh(), '100', '110');

        Mail::assertNothingSent();
        $this->assertDatabaseCount('portfolio_price_alert_subscriptions', 1);
    }

    public function test_no_email_when_previous_price_was_null(): void
    {
        Mail::fake();

        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'price' => 100,
            'is_published' => true,
        ]);

        PortfolioPriceAlertSubscription::query()->create([
            'portfolio_item_id' => $item->id,
            'email' => 'buyer@example.com',
        ]);

        PortfolioPriceAlertSubscription::notifySubscribersIfPriceDropped($item->fresh(), null, '90');

        Mail::assertNothingSent();
    }
}
