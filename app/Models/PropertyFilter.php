<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyFilter extends Model
{
    protected $fillable = [
        'key',
        'name_en',
        'name_ro',
        'is_active',
        'is_searchable',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_searchable' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function values(): HasMany
    {
        return $this->hasMany(PortfolioItemPropertyFilterValue::class)->orderBy('sort_order')->orderBy('id');
    }

    public function nameForLocale(?string $locale = null): string
    {
        $locale ??= app()->getLocale();
        if ($locale === 'ro') {
            return $this->name_ro !== '' ? $this->name_ro : $this->name_en;
        }

        return $this->name_en !== '' ? $this->name_en : $this->name_ro;
    }

    /**
     * @return list<array{id: int, key: string, label: string, is_searchable: bool, is_active: bool}>
     */
    public static function optionsForForm(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return static::query()
            ->ordered()
            ->get()
            ->map(fn (self $filter) => [
                'id' => $filter->id,
                'key' => $filter->key,
                'label' => $filter->nameForLocale($locale).($filter->is_active ? '' : ' (inactive)'),
                'is_searchable' => $filter->is_searchable,
                'is_active' => $filter->is_active,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{id: int, key: string, label: string}>
     */
    public static function searchableOptionsForPublic(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return static::query()
            ->active()
            ->searchable()
            ->ordered()
            ->get()
            ->map(fn (self $filter) => [
                'id' => $filter->id,
                'key' => $filter->key,
                'label' => $filter->nameForLocale($locale),
            ])
            ->values()
            ->all();
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeSearchable(Builder $query): Builder
    {
        return $query->where('is_searchable', true);
    }
}
