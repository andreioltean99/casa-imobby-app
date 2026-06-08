<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use App\Support\SiteOrigin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
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

    public function test_sitemap_uses_canonical_origin_in_production_when_app_url_is_local(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        Config::set('app.url', 'http://localhost');

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertSee(SiteOrigin::CANONICAL.'/proprietati', false);
    }

    public function test_sitemap_uses_canonical_origin_in_production_when_app_url_is_staging_host(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        Config::set('app.url', 'http://casa-imobby.aao-soft.com');

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertSee(SiteOrigin::CANONICAL.'/proprietati', false);
        $response->assertDontSee('casa-imobby.aao-soft.com', false);
    }

    public function test_site_origin_keeps_local_url_outside_production(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        Config::set('app.url', 'http://localhost');

        $this->assertSame('http://localhost', SiteOrigin::resolve());
    }

    public function test_site_origin_uses_canonical_in_production_even_when_app_url_matches(): void
    {
        $this->app->detectEnvironment(fn () => 'production');
        Config::set('app.url', 'https://agentia-casa-imobby.ro');

        $this->assertSame(SiteOrigin::CANONICAL, SiteOrigin::resolve());
    }

    public function test_site_origin_uses_staging_app_url_outside_production(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        Config::set('app.url', 'http://casa-imobby.aao-soft.com');

        $this->assertSame('http://casa-imobby.aao-soft.com', SiteOrigin::resolve());
    }
}
