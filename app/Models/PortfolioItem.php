<?php

namespace App\Models;

use Database\Factories\PortfolioItemFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class PortfolioItem extends Model
{
    /** @use HasFactory<PortfolioItemFactory> */
    use HasFactory;

    public const PUBLIC_REF_PREFIX = 'CIMB';

    /** @var list<string> Slugs seeded for layout demos — never shown as “similar listings”. */
    public const DEMO_SLUGS = [
        'exemplu-cluj',
        'demo-teren-cluj',
        'sample-listing',
    ];

    protected $fillable = [
        'title',
        'slug',
        'locale',
        'listing_category',
        'zone',
        'short_description',
        'description',
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
        'price' => 'decimal:2',
    ];

    public function gallery(): HasMany
    {
        return $this->hasMany(PortfolioItemImage::class)->orderByRaw('COALESCE(sort_order, 999999)')->orderBy('id');
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
     * @param  Builder<PortfolioItem>  $query
     * @return Builder<PortfolioItem>
     */
    public function scopeExcludeDemo(Builder $query): Builder
    {
        return $query
            ->where(function (Builder $q) {
                $q->whereNull('external_listing_ref')
                    ->orWhere('external_listing_ref', 'not like', 'DEMO-%');
            })
            ->where(function (Builder $q) {
                $q->whereRaw('lower(title) not like ?', ['%exemplu%'])
                    ->whereRaw('lower(title) not like ?', ['%(demo)%'])
                    ->whereRaw('lower(title) not like ?', ['%sample (demo)%']);
            });
    }

    public function isDemoListing(): bool
    {
        $ref = trim((string) ($this->external_listing_ref ?? ''));
        if (str_starts_with(strtoupper($ref), 'DEMO-')) {
            return true;
        }

        $title = mb_strtolower(trim((string) $this->title));

        return str_contains($title, 'exemplu')
            || str_contains($title, '(demo)')
            || str_contains($title, 'sample (demo)');
    }

    protected static function booted(): void
    {
        static::created(function (self $item): void {
            $item->assignPublicSlug();
        });
    }

    public function publicReference(): string
    {
        $external = trim((string) ($this->external_listing_ref ?? ''));

        if ($external !== '') {
            return $external;
        }

        return self::PUBLIC_REF_PREFIX.'-'.$this->id;
    }

    public function publicUrlSegment(): string
    {
        $segment = Str::slug($this->publicReference());

        if ($segment !== '') {
            return $segment;
        }

        return Str::slug(self::PUBLIC_REF_PREFIX.'-'.$this->id);
    }

    public function assignPublicSlug(): void
    {
        if (! $this->id) {
            return;
        }

        $slug = $this->uniquePublicSlug(
            $this->publicUrlSegment(),
            (string) $this->locale,
            $this->id,
        );

        if ($this->slug !== $slug) {
            $this->forceFill(['slug' => $slug])->saveQuietly();
        }
    }

    protected function uniquePublicSlug(string $slug, string $locale, int $excludeId): string
    {
        $base = $slug;
        $i = 0;

        while (true) {
            $query = static::query()
                ->where('slug', $slug)
                ->where('locale', $locale)
                ->where('id', '!=', $excludeId);

            if (! $query->exists()) {
                return $slug;
            }

            $i++;
            $slug = $base.'-'.$i;
        }
    }

    /**
     * Find a published listing by public URL segment (reference slug, legacy slug, or numeric id).
     */
    public static function findPublishedByPublicIdentifier(string $identifier): ?self
    {
        $identifier = trim(rawurldecode($identifier));
        $normalized = Str::slug($identifier);

        $base = static::query()
            ->where('is_published', true)
            ->where(function ($query) use ($identifier, $normalized) {
                $query->where('slug', $identifier);

                if ($normalized !== '') {
                    $query->orWhere('slug', $normalized);
                }

                if (ctype_digit($identifier)) {
                    $query->orWhere('id', (int) $identifier);
                }

                if (preg_match('/^cimb-(\d+)$/i', $identifier, $matches) === 1) {
                    $query->orWhere('id', (int) $matches[1]);
                }

                $query->orWhere('external_listing_ref', $identifier);

                if ($identifier !== '') {
                    $query->orWhereRaw('LOWER(external_listing_ref) = ?', [Str::lower($identifier)]);
                }
            });

        $localized = (clone $base)->where('locale', app()->getLocale())->first();

        return $localized ?? $base->first();
    }
}
