<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PortfolioItem extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'locale',
        'short_description',
        'description',
        'image_path',
        'date',
        'duration',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function gallery(): HasMany
    {
        return $this->hasMany(PortfolioItemImage::class)->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id');
    }
}
