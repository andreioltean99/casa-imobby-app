<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_xml_contains_static_and_listing_urls(): void
    {
        $item = PortfolioItem::factory()->create([
            'is_published' => true,
            'locale' => 'ro',
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $response->assertSee('/proprietati', false);
        $response->assertSee('/contact', false);
        $response->assertSee('/portfolio/'.$item->publicUrlSegment(), false);
    }
}
