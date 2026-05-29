<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioPublicUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_listing_uses_cimb_reference_in_public_url(): void
    {
        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $this->assertSame('cimb-'.$item->id, $item->fresh()->slug);

        $this->get(route('portfolio.show', ['slug' => $item->publicUrlSegment()]))
            ->assertOk();
    }

    public function test_custom_external_reference_is_used_in_url(): void
    {
        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'is_published' => true,
            'external_listing_ref' => 'REF-42',
        ]);

        $this->assertSame('ref-42', $item->fresh()->slug);

        $this->get(route('portfolio.show', ['slug' => 'ref-42']))
            ->assertOk();
    }

    public function test_legacy_title_slug_redirects_to_reference_slug(): void
    {
        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $item->forceFill(['slug' => 'apartament-cluj-centru'])->saveQuietly();

        $this->get(route('portfolio.show', ['slug' => 'apartament-cluj-centru']))
            ->assertRedirect(route('portfolio.show', ['slug' => $item->publicUrlSegment()]));
    }

    public function test_public_reference_label_uses_cimb_prefix(): void
    {
        $item = PortfolioItem::factory()->create([
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $this->assertSame('CIMB-'.$item->id, $item->publicReference());
    }
}
