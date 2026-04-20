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
                'title' => 'Exemplu unitate — Cluj-Napoca',
                'short_description' => 'Listare demonstrativă pentru dezvoltare locală.',
                'listing_specs' => [
                    ['label' => 'Nr. camere', 'value' => '2'],
                    ['label' => 'Suprafață utilă', 'value' => '47 mp'],
                    ['label' => 'Nr. băi', 'value' => '1'],
                    ['label' => 'Nr. balcoane', 'value' => '1'],
                    ['label' => 'Etaj', 'value' => '4 / 7'],
                    ['label' => 'Locuri de parcare', 'value' => '1, garaj'],
                    ['label' => 'Tip compartimentare', 'value' => 'Semidecomandat'],
                    ['label' => 'Vechime apartament', 'value' => 'Nou'],
                    ['label' => 'Tip imobil', 'value' => 'Bloc de apartamente'],
                    ['label' => 'Dotări', 'value' => 'Mobilat/utilat'],
                    ['label' => 'Anul construcției', 'value' => '2017'],
                    ['label' => 'Tip finisaj', 'value' => 'Finisat'],
                ],
                'external_listing_ref' => 'P169884',
                'description' => <<<'HTML'
<p>Se oferă spre vânzare apartament modern, situat în ansamblul rezidențial Ego Residence, pe strada Lombului, Cluj-Napoca.</p>
<p>Locuința are o suprafață utilă de 47 mp și este amplasată la etajul 4 din 6 al unui imobil dotat cu două lifturi moderne, oferind un bun echilibru între accesibilitate și confort.</p>
<p>Compartimentarea este eficientă și include living cu bucătărie open-space, dormitor, baie și balcon.</p>
<p>Apartamentul se vinde complet mobilat și utilat, fiind pregătit pentru mutare imediată. Electrocasnicele sunt în garanție, iar confortul este completat de aer condiționat instalat atât în living, cât și în dormitor. Finisajele sunt moderne, iar poziționarea la etaj intermediar contribuie la o eficiență termică ridicată.</p>
<p>În preț este inclus și un loc de parcare subteran.</p>
<p>Proprietatea beneficiază de acces facil către centrul orașului, fiind situată în apropierea stațiilor de transport în comun, magazinelor și a altor puncte de interes.</p>
HTML,
                'image_path' => null,
                'date' => (string) now()->year,
                'duration' => null,
                'is_published' => true,
                'sort_order' => 1,
            ],
        );

        PortfolioItem::query()->updateOrCreate(
            ['slug' => 'sample-listing', 'locale' => 'en'],
            [
                'title' => 'Sample listing — Cluj-Napoca',
                'short_description' => 'Demo entry for local development.',
                'listing_specs' => [
                    ['label' => 'Rooms', 'value' => '2'],
                    ['label' => 'Usable area', 'value' => '47 sqm'],
                    ['label' => 'Bathrooms', 'value' => '1'],
                    ['label' => 'Floor', 'value' => '4 / 7'],
                    ['label' => 'Parking', 'value' => '1 underground space'],
                    ['label' => 'Layout', 'value' => 'Semi-detached plan'],
                    ['label' => 'Building type', 'value' => 'Apartment block'],
                    ['label' => 'Furnishing', 'value' => 'Furnished & equipped'],
                    ['label' => 'Year built', 'value' => '2017'],
                ],
                'external_listing_ref' => 'DEMO-EN-001',
                'description' => '<p>Replace this from the admin dashboard or publish a real listing. The characteristics table above is sample data for layout preview.</p>',
                'image_path' => null,
                'date' => (string) now()->year,
                'duration' => null,
                'is_published' => true,
                'sort_order' => 2,
            ],
        );
    }
}
