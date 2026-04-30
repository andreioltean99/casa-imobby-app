<?php

namespace App\Mail;

use App\Models\PortfolioItem;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PortfolioPriceDroppedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PortfolioItem $item,
        public float $oldPrice,
        public float $newPrice,
    ) {}

    public function envelope(): Envelope
    {
        $locale = $this->item->locale ?? config('app.locale');

        return new Envelope(
            subject: trans('website.portfolio.price_drop_mail_subject', ['title' => $this->item->title], $locale),
        );
    }

    public function content(): Content
    {
        $locale = $this->item->locale ?? config('app.locale');

        return new Content(
            html: 'emails.portfolio-price-dropped-html',
            with: [
                'item' => $this->item,
                'oldPrice' => $this->oldPrice,
                'newPrice' => $this->newPrice,
                'locale' => $locale,
                'listingUrl' => route('portfolio.show', [
                    'slug' => $this->item->slug !== '' ? $this->item->slug : (string) $this->item->id,
                ], absolute: true),
            ],
        );
    }
}
