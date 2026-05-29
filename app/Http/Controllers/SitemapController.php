<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $baseUrl = rtrim((string) config('app.url', ''), '/');

        $staticUrls = [
            '/',
            '/proprietati',
            '/contact',
            '/terms',
            '/privacy',
        ];

        $listingUrls = PortfolioItem::query()
            ->where('is_published', true)
            ->get(['id', 'slug', 'external_listing_ref', 'updated_at'])
            ->map(fn (PortfolioItem $item) => [
                'loc' => '/portfolio/'.$item->publicUrlSegment(),
                'lastmod' => optional($item->updated_at)->toAtomString(),
            ])
            ->all();

        $urls = array_merge(
            array_map(fn (string $path) => ['loc' => $path, 'lastmod' => null], $staticUrls),
            $listingUrls,
        );

        $xml = $this->renderXml($baseUrl, $urls);

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }

    /**
     * @param  array<int, array{loc: string, lastmod: string|null}>  $urls
     */
    protected function renderXml(string $baseUrl, array $urls): string
    {
        $rows = [];
        foreach ($urls as $url) {
            $loc = htmlspecialchars($baseUrl.$url['loc'], ENT_XML1);
            $row = "<url><loc>{$loc}</loc>";
            if (! empty($url['lastmod'])) {
                $lastmod = htmlspecialchars((string) $url['lastmod'], ENT_XML1);
                $row .= "<lastmod>{$lastmod}</lastmod>";
            }
            $row .= '</url>';
            $rows[] = $row;
        }

        return '<?xml version="1.0" encoding="UTF-8"?>'
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            .implode('', $rows)
            .'</urlset>';
    }
}
