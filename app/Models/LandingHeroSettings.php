<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingHeroSettings extends Model
{
    protected $table = 'landing_hero_settings';

    protected $fillable = [
        'locale',
        // Hero text
        'eyebrow',
        'title',
        'body',
        'primary_cta',
        'secondary_cta',
        // Section heading
        'end_to_end_heading',
        // Stats labels + values
        'years_experience',
        'years_experience_value',
        'completed_projects',
        'completed_projects_value',
        'industries_served',
        'industries_list',
        // End-to-end steps (part of hero section)
        'step1_title',
        'step1_body',
        'step2_title',
        'step2_body',
        'step3_title',
        'step3_body',
    ];

    protected $casts = [
        'years_experience_value' => 'integer',
        'completed_projects_value' => 'integer',
    ];
}

