<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ContactSettings extends Model
{
    protected $table = 'contact_settings';

    /**
     * Load or create contact copy for a public locale (same defaults as the home page).
     */
    public static function resolveForLocale(?string $locale = null): self
    {
        $locale ??= app()->getLocale();

        $defaultsByLocale = [
            'en' => [
                'section_title' => 'Get in touch today',
                'section_body' => 'Tell us what you are looking for — we will respond with next steps and available options.',
                'contact_details_title' => 'Contact details',
                'address' => 'Cluj-Napoca, România',
                'email' => 'office@casa-imobby.ro',
                'contact_person_name' => 'Ploscar Gheorghe Dumitru',
                'phone' => '0741634486',
                'map_placeholder' => 'Embedded map / site photo placeholder',
            ],
            'ro' => [
                'section_title' => 'Ia legătura cu noi',
                'section_body' => 'Spune-ne ce cauți — îți răspundem cu pașii următori și opțiunile disponibile.',
                'contact_details_title' => 'Detalii de contact',
                'address' => 'Cluj-Napoca, România',
                'email' => 'office@casa-imobby.ro',
                'contact_person_name' => 'Ploscar Gheorghe Dumitru',
                'phone' => '0741634486',
                'map_placeholder' => 'Placeholder pentru hartă / fotografie sediu',
            ],
        ];

        $defaults = $defaultsByLocale[$locale] ?? $defaultsByLocale['en'];

        return self::query()->firstOrCreate(
            ['locale' => $locale],
            $defaults,
        );
    }

    protected $fillable = [
        'locale',
        'section_title',
        'section_body',
        'contact_details_title',
        'address',
        'email',
        'contact_person_name',
        'contact_person_photo_path',
        'phone',
        'map_placeholder',
    ];

    protected $appends = [
        'contact_person_photo_url',
    ];

    public function getContactPersonPhotoUrlAttribute(): ?string
    {
        if (! $this->contact_person_photo_path) {
            return null;
        }

        return Storage::disk('public')->url($this->contact_person_photo_path);
    }
}
