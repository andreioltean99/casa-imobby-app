<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = 'Password2026!';

        $users = [
            [
                'email' => 'andrei.oltean@aao-soft.com',
                'name' => 'Andrei Oltean',
            ],
            [
                'email' => 'admin@casa-imobby.ro',
                'name' => 'Adrian Poloca',
            ],
            [
                'email' => 'pocolaoctavian@gmail.com',
                'name' => 'Pocola Octavian',
            ],
        ];

        foreach ($users as $user) {
            User::query()->updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
