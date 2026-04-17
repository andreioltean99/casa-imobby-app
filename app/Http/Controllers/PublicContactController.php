<?php

namespace App\Http\Controllers;

use App\Models\ContactSettings;
use Inertia\Inertia;

class PublicContactController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('public/contact', [
            'contact' => ContactSettings::resolveForLocale(),
            'translations' => trans('website'),
        ]);
    }
}
