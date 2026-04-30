<?php

namespace App\Models;

use App\Mail\PortfolioPriceDroppedNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Mail;

class PortfolioPriceAlertSubscription extends Model
{
    protected $table = 'portfolio_price_alert_subscriptions';

    protected $fillable = [
        'portfolio_item_id',
        'email',
        'reference_price',
    ];

    protected $casts = [
        'reference_price' => 'decimal:2',
    ];

    public function portfolioItem(): BelongsTo
    {
        return $this->belongsTo(PortfolioItem::class);
    }

    /**
     * Notify subscribers when the listing price drops, then update their reference price to the new value.
     */
    public static function notifySubscribersIfPriceDropped(PortfolioItem $item, mixed $oldPrice, mixed $newPrice): void
    {
        if ($oldPrice === null || $newPrice === null) {
            return;
        }

        $old = (float) $oldPrice;
        $new = (float) $newPrice;

        if (! ($new < $old)) {
            return;
        }

        $subscriptions = static::query()->where('portfolio_item_id', $item->id)->get();

        foreach ($subscriptions as $subscription) {
            Mail::to($subscription->email)->send(
                new PortfolioPriceDroppedNotification($item, $old, $new),
            );
        }

        static::query()->where('portfolio_item_id', $item->id)->update([
            'reference_price' => $newPrice,
        ]);
    }
}
