<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioItemPropertyFilterValue extends Model
{
    protected $fillable = [
        'portfolio_item_id',
        'property_filter_id',
        'value',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function portfolioItem(): BelongsTo
    {
        return $this->belongsTo(PortfolioItem::class);
    }

    public function propertyFilter(): BelongsTo
    {
        return $this->belongsTo(PropertyFilter::class);
    }
}
