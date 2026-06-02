<?php

namespace Tests\Feature;

use App\Models\Testimonial;
use App\Models\TestimonialSectionSettings;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialSectionVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_hides_testimonials_section_by_default(): void
    {
        Testimonial::query()->create([
            'is_published' => true,
            'name' => 'Client',
            'quote' => 'Great service.',
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/home')
                ->where('showTestimonialsSection', false)
                ->has('testimonials', 0));
    }

    public function test_homepage_shows_testimonials_when_enabled_in_admin(): void
    {
        TestimonialSectionSettings::query()->create([
            'locale' => 'ro',
            'show_on_homepage' => true,
        ]);

        Testimonial::query()->create([
            'is_published' => true,
            'name' => 'Client',
            'quote' => 'Great service.',
        ]);

        app()->setLocale('ro');

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('public/home')
                ->where('showTestimonialsSection', true)
                ->has('testimonials', 1));
    }

    public function test_admin_can_toggle_testimonial_section_visibility(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->put(route('dashboard.testimonials.section-settings.update'), [
                'show_on_homepage' => true,
            ])
            ->assertRedirect(route('dashboard.testimonials.index'));

        $this->assertDatabaseHas('testimonial_section_settings', [
            'locale' => app()->getLocale(),
            'show_on_homepage' => true,
        ]);
    }
}
