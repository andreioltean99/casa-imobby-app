<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default admin user used by blog admin authorization logic.
        $this->call(DefaultUserSeeder::class);
        $this->call(DemoPortfolioSeeder::class);
    }
}
