<?php

namespace Database\Seeders;

use App\Console\Commands\EnsureAdminUsersCommand;
use App\Models\User;
use Illuminate\Database\Seeder;

class DefaultUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = EnsureAdminUsersCommand::defaultPassword();

        foreach (EnsureAdminUsersCommand::defaultUsers() as $user) {
            User::query()->firstOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => $password,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
