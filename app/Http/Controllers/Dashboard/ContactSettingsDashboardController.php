<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ContactSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContactSettingsDashboardController extends Controller
{
    public function edit()
    {
        $locale = app()->getLocale();

        $defaultsByLocale = [
            'en' => [
                'section_title' => 'Get in touch today',
                'section_body' => 'Tell us what you are looking for — we will respond with next steps and available options.',
                'contact_details_title' => 'Contact details',
                'address' => 'Cluj-Napoca, România',
                'email' => 'office@casa-imobby.ro',
                'contact_person_name' => 'Ploscar Gheorghe Dumitru',
                'phone' => '0741634486',
                'map_placeholder' => 'Embedded map / site photo placeholder',
            ],
            'ro' => [
                'section_title' => 'Ia legătura cu noi',
                'section_body' => 'Spune-ne ce cauți — îți răspundem cu pașii următori și opțiunile disponibile.',
                'contact_details_title' => 'Detalii de contact',
                'address' => 'Cluj-Napoca, România',
                'email' => 'office@casa-imobby.ro',
                'contact_person_name' => 'Ploscar Gheorghe Dumitru',
                'phone' => '0741634486',
                'map_placeholder' => 'Placeholder pentru hartă / fotografie sediu',
            ],
        ];

        $defaults = $defaultsByLocale[$locale] ?? $defaultsByLocale['en'];

        $contact = ContactSettings::query()->firstOrCreate(
            ['locale' => $locale],
            $defaults
        );

        return Inertia::render('dashboard/contact', [
            'page' => $contact,
        ]);
    }

    public function update(Request $request)
    {
        $locale = app()->getLocale();

        $data = $request->validate([
            'section_title' => ['required', 'string', 'max:255'],
            'section_body' => ['required', 'string'],
            'contact_details_title' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:2000'],
            'email' => ['nullable', 'email', 'max:255'],
            'contact_person_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'map_placeholder' => ['nullable', 'string', 'max:255'],
            'contact_person_photo' => ['nullable', 'image', 'max:4096'],
        ]);

        $contact = ContactSettings::query()->firstOrCreate(
            ['locale' => $locale],
            [
                'section_title' => '',
                'section_body' => '',
                'contact_details_title' => '',
                'address' => null,
                'email' => null,
                'contact_person_name' => null,
                'contact_person_photo_path' => null,
                'phone' => null,
                'map_placeholder' => '',
            ]
        );

        unset($data['contact_person_photo']);

        if ($request->hasFile('contact_person_photo')) {
            if ($contact->contact_person_photo_path) {
                Storage::disk('public')->delete($contact->contact_person_photo_path);
            }
            $data['contact_person_photo_path'] = $request->file('contact_person_photo')->store('contact/person', 'public');
        }

        $contact->update($data);

        return redirect()
            ->route('dashboard.contact.edit')
            ->with('status', 'Contact information updated.');
    }
}
