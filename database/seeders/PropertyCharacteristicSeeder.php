<?php

namespace Database\Seeders;

use App\Models\PropertyFilter;
use Illuminate\Database\Seeder;

/**
 * Default property characteristics aligned with Imobiliare.ro apartment search filters
 * (e.g. agency listing pages: rooms, area, bathrooms, floor, partitioning, comfort, build stage, amenities).
 */
class PropertyCharacteristicSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['key' => 'camere', 'name_ro' => 'Nr. camere', 'name_en' => 'Rooms'],
            ['key' => 'suprafata_utila', 'name_ro' => 'Suprafață utilă', 'name_en' => 'Usable area'],
            ['key' => 'nr_bai', 'name_ro' => 'Băi', 'name_en' => 'Bathrooms'],
            ['key' => 'etaj', 'name_ro' => 'Etaj', 'name_en' => 'Floor'],
            ['key' => 'tip_compartimentare', 'name_ro' => 'Compartimentare', 'name_en' => 'Layout'],
            ['key' => 'nivel_confort', 'name_ro' => 'Confort', 'name_en' => 'Comfort level'],
            ['key' => 'stadiu_constructie', 'name_ro' => 'Stadiu construcție', 'name_en' => 'Construction stage'],
            ['key' => 'anul_constructiei', 'name_ro' => 'Anul construcției', 'name_en' => 'Year built'],
            ['key' => 'dotari', 'name_ro' => 'Facilități', 'name_en' => 'Amenities'],
            ['key' => 'locuri_parcare', 'name_ro' => 'Parcare', 'name_en' => 'Parking'],
            ['key' => 'proximitate', 'name_ro' => 'În apropiere', 'name_en' => 'Nearby'],
            ['key' => 'nr_balcoane', 'name_ro' => 'Nr. balcoane', 'name_en' => 'Balconies'],
            ['key' => 'tip_imobil', 'name_ro' => 'Tip imobil', 'name_en' => 'Building type'],
            ['key' => 'tip_finisaj', 'name_ro' => 'Tip finisaj', 'name_en' => 'Finish type'],
        ];

        foreach ($rows as $index => $row) {
            PropertyFilter::query()->updateOrCreate(
                ['key' => $row['key']],
                [
                    'name_ro' => $row['name_ro'],
                    'name_en' => $row['name_en'],
                    'sort_order' => $index,
                    'is_active' => true,
                    'is_searchable' => true,
                ],
            );
        }

        // Replaced by stadiu_constructie on Imobiliare.ro (build / year ranges).
        PropertyFilter::query()
            ->where('key', 'vechime_apartament')
            ->update(['is_active' => false, 'is_searchable' => false]);
    }
}
