<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Models\PortfolioPriceAlertSubscription;
use Illuminate\Http\Request;

class PortfolioPriceAlertController extends Controller
{
    public function store(Request $request, string $identifier)
    {
        $item = PortfolioItem::findPublishedByPublicIdentifier($identifier);

        if (! $item) {
            abort(404);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = mb_strtolower(trim($validated['email']));

        // One row per listing + email; refresh reference_price to current listing price (no duplicates).
        PortfolioPriceAlertSubscription::query()->updateOrCreate(
            [
                'portfolio_item_id' => $item->id,
                'email' => $email,
            ],
            [
                'reference_price' => $item->price,
            ],
        );

        return back();
    }
}
