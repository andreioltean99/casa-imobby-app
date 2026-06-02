<?php

namespace Database\Seeders;

use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;

class DemoPortfolioSeeder extends Seeder
{
    /**
     * Published sample listings so /portfolio and /portfolio/{id} work after a fresh migrate.
     */
    public function run(): void
    {
        PortfolioItem::query()->updateOrCreate(
            ['slug' => 'exemplu-cluj', 'locale' => 'ro'],
            [
                'title' => 'Apartament de închiriat — exemplu Cluj-Napoca',
                'short_description' => 'Listare demonstrativă (categoria „Apartamente de închiriat” pe pagina principală).',
                'listing_category' => 'apartment_rent',
                'pinned_home' => true,
                'pinned_home_order' => 1,
                'external_listing_ref' => null,
                'external_storia_url' => 'https://www.storia.ro/',
                'external_imobiliare_url' => 'https://www.imobiliare.ro/',
                'external_olx_url' => 'https://www.olx.ro/',
                'description' => <<<'HTML'
<p>Exemplu de anunț pentru închiriere — înlocuiește textul din panoul de administrare.</p>
<p>Apartament modern, situat în ansamblul rezidențial Ego Residence, pe strada Lombului, Cluj-Napoca.</p>
<p>Suprafață utilă 47 mp, etaj 4 din 6, imobil cu două lifturi. Living cu bucătărie open-space, dormitor, baie și balcon.</p>
<p>Mobilat și utilat, aer condiționat în living și dormitor. Loc de parcare subteran inclus.</p>
HTML,
                'image_path' => null,
                'date' => null,
                'duration' => null,
                'price' => 650,
                'is_published' => true,
                'sort_order' => 1,
            ],
        );

        PortfolioItem::query()->updateOrCreate(
            ['slug' => 'demo-teren-cluj', 'locale' => 'ro'],
            [
                'title' => 'Teren intravilan — exemplu (demo)',
                'short_description' => 'Listare demonstrativă pentru secțiunea „Terenuri”.',
                'description' => '<p>Înlocuiește acest text cu detaliile reale ale terenului.</p>',
                'image_path' => null,
                'date' => null,
                'duration' => null,
                'price' => 95000,
                'listing_category' => 'land_sale',
                'pinned_home' => false,
                'pinned_home_order' => null,
                'is_published' => true,
                'sort_order' => 3,
            ],
        );

        PortfolioItem::query()->updateOrCreate(
            ['slug' => 'sample-listing', 'locale' => 'en'],
            [
                'title' => 'House for sale — sample (demo)',
                'short_description' => 'Demo entry mapped to “Houses for sale” on the home page.',
                'listing_category' => 'case_sale',
                'pinned_home' => false,
                'pinned_home_order' => null,
                'external_listing_ref' => 'DEMO-EN-001',
                'external_storia_url' => 'https://www.storia.ro/',
                'external_imobiliare_url' => 'https://www.imobiliare.ro/',
                'external_olx_url' => 'https://www.olx.ro/',
                'description' => '<p>Replace this from the admin dashboard or publish a real listing. The characteristics table above is sample data for layout preview.</p>',
                'image_path' => null,
                'date' => null,
                'duration' => null,
                'price' => 120000,
                'is_published' => true,
                'sort_order' => 2,
            ],
        );

        PortfolioItem::query()->each(fn (PortfolioItem $item) => $item->assignPublicSlug());
    }
}
