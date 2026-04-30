<?php

namespace Database\Seeders;

use App\Models\PortfolioListingCategory;
use Illuminate\Database\Seeder;

class PortfolioListingCategorySeeder extends Seeder
{
    /**
     * Default listing categories (keys match portfolio_items.listing_category).
     *
     * @var list<array{key: string, name_en: string, name_ro: string, sort_order: int, is_active: bool}>
     */
    protected array $rows = [
        ['key' => 'apartment_sale', 'name_en' => 'Apartments for sale', 'name_ro' => 'Apartamente de vânzare', 'sort_order' => 10, 'is_active' => true],
        ['key' => 'case_sale', 'name_en' => 'Houses for sale', 'name_ro' => 'Case de vânzare', 'sort_order' => 20, 'is_active' => true],
        ['key' => 'land_sale', 'name_en' => 'Land for sale', 'name_ro' => 'Terenuri', 'sort_order' => 30, 'is_active' => true],
        ['key' => 'commercial_sale', 'name_en' => 'Commercial space for sale', 'name_ro' => 'Spații comerciale de vânzare', 'sort_order' => 40, 'is_active' => true],
        ['key' => 'industrial_sale', 'name_en' => 'Industrial space for sale', 'name_ro' => 'Spații industriale de vânzare', 'sort_order' => 50, 'is_active' => true],
        ['key' => 'office_sale', 'name_en' => 'Office space for sale', 'name_ro' => 'Spații birouri de vânzare', 'sort_order' => 60, 'is_active' => true],
        ['key' => 'apartment_rent', 'name_en' => 'Apartments for rent', 'name_ro' => 'Apartamente de închiriat', 'sort_order' => 70, 'is_active' => true],
        ['key' => 'house_rent', 'name_en' => 'Houses for rent', 'name_ro' => 'Case de închiriat', 'sort_order' => 80, 'is_active' => true],
        ['key' => 'commercial_rent', 'name_en' => 'Commercial space for rent', 'name_ro' => 'Spații comerciale de închiriat', 'sort_order' => 90, 'is_active' => true],
        ['key' => 'industrial_rent', 'name_en' => 'Industrial space for rent', 'name_ro' => 'Spații industriale de închiriat', 'sort_order' => 100, 'is_active' => true],
    ];

    public function run(): void
    {
        foreach ($this->rows as $row) {
            PortfolioListingCategory::query()->updateOrCreate(
                ['key' => $row['key']],
                [
                    'name_en' => $row['name_en'],
                    'name_ro' => $row['name_ro'],
                    'sort_order' => $row['sort_order'],
                    'is_active' => $row['is_active'],
                ],
            );
        }
    }
}
