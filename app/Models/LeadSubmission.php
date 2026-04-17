<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadSubmission extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'budget',
        'newsletter',
        'terms_accepted',
    ];

    protected function casts(): array
    {
        return [
            'newsletter' => 'boolean',
            'terms_accepted' => 'boolean',
        ];
    }
}
