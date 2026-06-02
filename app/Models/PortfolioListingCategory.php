<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PortfolioListingCategory extends Model
{
    protected $fillable = [
        'key',
        'name_en',
        'name_ro',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function titlesForLocale(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return static::query()
            ->ordered()
            ->get()
            ->mapWithKeys(fn (self $c) => [$c->key => $c->nameForLocale($locale)])
            ->all();
    }

    /**
     * @return list<array{value: string, label: string, is_active: bool}>
     */
    public static function optionsForForm(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return static::query()
            ->ordered()
            ->get()
            ->map(fn (self $c) => [
                'value' => $c->key,
                'label' => $c->nameForLocale($locale).($c->is_active ? '' : ' (inactive)'),
                'is_active' => $c->is_active,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{value: string, label: string, is_active: bool}>
     */
    public static function activeOptionsForForm(?string $locale = null): array
    {
        $locale ??= app()->getLocale();

        return static::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (self $c) => [
                'value' => $c->key,
                'label' => $c->nameForLocale($locale),
                'is_active' => true,
            ])
            ->values()
            ->all();
    }

    public function nameForLocale(?string $locale = null): string
    {
        $locale ??= app()->getLocale();
        if ($locale === 'ro') {
            return $this->name_ro !== '' ? $this->name_ro : $this->name_en;
        }

        return $this->name_en !== '' ? $this->name_en : $this->name_ro;
    }

    public static function generateUniqueKey(): string
    {
        do {
            $key = 'c_'.strtolower(Str::random(12));
        } while (static::query()->where('key', $key)->exists());

        return $key;
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
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
