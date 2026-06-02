<?php

namespace Tests\Unit;

use App\Http\Controllers\Dashboard\PortfolioDashboardController;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class ImobiliareImportExtractionTest extends TestCase
{
    public function test_extracts_zone_payment_and_amenities_from_floresti_fixture(): void
    {
        $fixture = dirname(__DIR__, 2).'/storage/app/imobiliare-test.html';
        if (! is_readable($fixture)) {
            $this->markTestSkipped('Imobiliare fixture HTML not available.');
        }

        $html = file_get_contents($fixture);
        $controller = new PortfolioDashboardController;
        $ref = new ReflectionClass($controller);

        $plain = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8')) ?? '');

        $zoneMethod = $ref->getMethod('extractZoneValue');
        $zoneMethod->setAccessible(true);
        $zone = $zoneMethod->invoke($controller, $html, $plain);

        $this->assertSame('Florești, Județul Cluj', $zone);
        $this->assertStringNotContainsString('€', (string) $zone);

        $specMethod = $ref->getMethod('extractSpecificationPairsFromHtml');
        $specMethod->setAccessible(true);
        $pairs = $specMethod->invoke($controller, $html);
        $byLabel = [];
        foreach ($pairs as $pair) {
            $byLabel[$pair['label']] = $pair['value'];
        }

        $this->assertSame('Cash sau Credit', $byLabel['Modalitate de plată'] ?? null);
        $this->assertSame('1', $byLabel['Nr. bucătării'] ?? null);

        $amenitiesMethod = $ref->getMethod('extractImobiliareAmenitiesSummary');
        $amenitiesMethod->setAccessible(true);
        $amenities = $amenitiesMethod->invoke($controller, $html);

        $this->assertNotNull($amenities);
        $this->assertStringContainsString('Pereți: Faianță', (string) $amenities);
        $this->assertStringContainsString('Facilități imobil: Lift', (string) $amenities);
        $this->assertStringContainsString('Internet: Cablu', (string) $amenities);

        $parkingCheck = $ref->getMethod('isPlausibleParkingValue');
        $parkingCheck->setAccessible(true);
        $this->assertFalse($parkingCheck->invoke($controller, 'Parcare pentru clienti aprox. 70 m'));
        $this->assertTrue($parkingCheck->invoke($controller, 'Subterană'));
    }
}
