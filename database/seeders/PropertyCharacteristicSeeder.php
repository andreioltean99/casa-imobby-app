<?php

namespace Database\Seeders;

use App\Models\PropertyFilter;
use Illuminate\Database\Seeder;

class PropertyCharacteristicSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['key' => 'camere', 'name_ro' => 'Camere', 'name_en' => 'Rooms'],
            ['key' => 'suprafata_utila', 'name_ro' => 'Suprafață utilă', 'name_en' => 'Usable area'],
            ['key' => 'nr_bai', 'name_ro' => 'Nr. băi', 'name_en' => 'Bathrooms'],
            ['key' => 'nr_balcoane', 'name_ro' => 'Nr. balcoane', 'name_en' => 'Balconies'],
            ['key' => 'etaj', 'name_ro' => 'Etaj', 'name_en' => 'Floor'],
            ['key' => 'locuri_parcare', 'name_ro' => 'Locuri de parcare', 'name_en' => 'Parking spaces'],
            ['key' => 'tip_compartimentare', 'name_ro' => 'Tip compartimentare', 'name_en' => 'Layout type'],
            ['key' => 'vechime_apartament', 'name_ro' => 'Vechime apartament', 'name_en' => 'Apartment age'],
            ['key' => 'tip_imobil', 'name_ro' => 'Tip imobil', 'name_en' => 'Building type'],
            ['key' => 'dotari', 'name_ro' => 'Dotări', 'name_en' => 'Amenities'],
            ['key' => 'anul_constructiei', 'name_ro' => 'Anul construcției', 'name_en' => 'Year built'],
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
    }
}
