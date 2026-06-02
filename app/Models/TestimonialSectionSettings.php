<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestimonialSectionSettings extends Model
{
    protected $table = 'testimonial_section_settings';

    protected $fillable = [
        'locale',
        'show_on_homepage',
    ];

    protected $casts = [
        'show_on_homepage' => 'boolean',
    ];

    public static function resolveForLocale(?string $locale = null): self
    {
        $locale ??= app()->getLocale();

        return self::query()->firstOrCreate(
            ['locale' => $locale],
            ['show_on_homepage' => false],
        );
    }
}
