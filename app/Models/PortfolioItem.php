<?php

namespace App\Models;

use Database\Factories\PortfolioItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PortfolioItem extends Model
{
    /** @use HasFactory<PortfolioItemFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'locale',
        'listing_category',
        'zone',
        'short_description',
        'description',
        'listing_specs',
        'external_listing_ref',
        'external_storia_url',
        'external_imobiliare_url',
        'external_olx_url',
        'listing_pdf_path',
        'image_path',
        'date',
        'duration',
        'price',
        'is_published',
        'pinned_home',
        'pinned_home_order',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'pinned_home' => 'boolean',
        'pinned_home_order' => 'integer',
        'sort_order' => 'integer',
        'listing_specs' => 'array',
        'price' => 'decimal:2',
    ];

    public function gallery(): HasMany
    {
        return $this->hasMany(PortfolioItemImage::class)->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id');
    }

    public function priceAlertSubscriptions(): HasMany
    {
        return $this->hasMany(PortfolioPriceAlertSubscription::class);
    }

    public function propertyFilterValues(): HasMany
    {
        return $this->hasMany(PortfolioItemPropertyFilterValue::class)
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function propertyFilters(): BelongsToMany
    {
        return $this->belongsToMany(PropertyFilter::class, 'portfolio_item_property_filter_values')
            ->withPivot(['value', 'sort_order'])
            ->withTimestamps();
    }

    /**
     * Find a published listing by public URL segment (slug or numeric id), preferring the active locale.
     */
    public static function findPublishedByPublicIdentifier(string $identifier): ?self
    {
        $base = static::query()
            ->where(function ($query) use ($identifier) {
                $query->where('slug', $identifier);

                if (ctype_digit($identifier)) {
                    $query->orWhere('id', (int) $identifier);
                }
            })
            ->where('is_published', true);

        $localized = (clone $base)->where('locale', app()->getLocale())->first();

        return $localized ?? $base->first();
    }
}
