<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialDashboardController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::orderByRaw('COALESCE(sort_order, 999999)')
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'name',
                'role',
                'quote',
                'image_path',
                'is_published',
                'sort_order',
            ]);

        return Inertia::render('dashboard/testimonials', [
            'testimonials' => $testimonials,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/testimonials-create');
    }

    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('dashboard/testimonials-edit', [
            'testimonial' => $testimonial,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validatedData($request);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('testimonials', 'public');
        }

        Testimonial::create($data);

        return redirect()
            ->route('dashboard.testimonials.index')
            ->with('status', 'Testimonial created.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $data = $this->validatedData($request, $testimonial->id);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('testimonials', 'public');
        }

        $testimonial->update($data);

        return redirect()
            ->route('dashboard.testimonials.index')
            ->with('status', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return redirect()
            ->route('dashboard.testimonials.index')
            ->with('status', 'Testimonial deleted.');
    }

    protected function validatedData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);
    }
}

