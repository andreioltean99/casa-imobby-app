<?php

namespace App\Models;

use Database\Factories\PortfolioItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PortfolioItem extends Model
{
    /** @use HasFactory<PortfolioItemFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'locale',
        'short_description',
        'description',
        'listing_specs',
        'external_listing_ref',
        'listing_pdf_path',
        'image_path',
        'date',
        'duration',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'listing_specs' => 'array',
    ];

    public function gallery(): HasMany
    {
        return $this->hasMany(PortfolioItemImage::class)->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id');
    }
}
