<?php

namespace Tests\Feature;

use App\Models\PortfolioItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioPdfTest extends TestCase
{
    use RefreshDatabase;

    public function test_portfolio_pdf_download_returns_pdf_for_published_listing(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'pdf-unit',
            'locale' => 'ro',
            'is_published' => true,
            'title' => 'Unitate test PDF',
        ]);

        $response = $this->get(route('portfolio.pdf', ['identifier' => $item->slug]));

        $response->assertOk();
        $this->assertStringStartsWith('%PDF', (string) $response->getContent());
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_portfolio_pdf_download_accepts_numeric_identifier(): void
    {
        $item = PortfolioItem::factory()->create([
            'slug' => 'numeric-pdf',
            'locale' => 'ro',
            'is_published' => true,
        ]);

        $response = $this->get(route('portfolio.pdf', ['identifier' => (string) $item->id]));

        $response->assertOk();
        $this->assertStringStartsWith('%PDF', (string) $response->getContent());
    }

    public function test_portfolio_pdf_returns_404_for_unpublished_listing(): void
    {
        $item = PortfolioItem::factory()->unpublished()->create([
            'slug' => 'draft-pdf',
            'locale' => 'ro',
        ]);

        $this->get(route('portfolio.pdf', ['identifier' => $item->slug]))->assertNotFound();
    }
}
