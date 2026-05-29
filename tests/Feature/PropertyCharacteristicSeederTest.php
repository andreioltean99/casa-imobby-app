<?php

namespace Tests\Feature;

use App\Models\PropertyFilter;
use Database\Seeders\PropertyCharacteristicSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyCharacteristicSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_imobiliare_aligned_default_characteristics(): void
    {
        PropertyFilter::query()->create([
            'key' => 'vechime_apartament',
            'name_ro' => 'Vechime apartament',
            'name_en' => 'Apartment age',
            'sort_order' => 99,
            'is_active' => true,
            'is_searchable' => true,
        ]);

        $this->seed(PropertyCharacteristicSeeder::class);

        $expectedKeys = [
            'camere',
            'suprafata_utila',
            'nr_bai',
            'etaj',
            'tip_compartimentare',
            'nivel_confort',
            'stadiu_constructie',
            'anul_constructiei',
            'dotari',
            'locuri_parcare',
            'proximitate',
            'nr_balcoane',
            'tip_imobil',
            'tip_finisaj',
        ];

        foreach ($expectedKeys as $key) {
            $this->assertDatabaseHas('property_filters', [
                'key' => $key,
                'is_active' => true,
                'is_searchable' => true,
            ]);
        }

        $this->assertSame('Nr. camere', PropertyFilter::query()->where('key', 'camere')->value('name_ro'));
        $this->assertSame('Facilități', PropertyFilter::query()->where('key', 'dotari')->value('name_ro'));

        $this->assertDatabaseHas('property_filters', [
            'key' => 'vechime_apartament',
            'is_active' => false,
            'is_searchable' => false,
        ]);
    }
}
