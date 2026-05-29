<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class EnsureAdminUsersCommand extends Command
{
    protected $signature = 'admin:ensure-users
                            {--reset-password : Reset password for all default admin accounts}';

    protected $description = 'Create default admin users if missing (does not overwrite existing passwords unless --reset-password is used)';

    /**
     * @return list<array{email: string, name: string}>
     */
    public static function defaultUsers(): array
    {
        return [
            [
                'email' => 'andrei.oltean@aao-soft.com',
                'name' => 'Andrei Oltean',
            ],
            [
                'email' => 'admin@casa-imobby.ro',
                'name' => 'Adrian Poloca',
            ]
        ];
    }

    public static function defaultPassword(): string
    {
        return (string) env('ADMIN_DEFAULT_PASSWORD', 'Password2026!');
    }

    public function handle(): int
    {
        $password = self::defaultPassword();
        $resetPassword = (bool) $this->option('reset-password');
        $created = 0;
        $updated = 0;

        foreach (self::defaultUsers() as $userData) {
            $user = User::query()->where('email', $userData['email'])->first();

            if ($user === null) {
                User::query()->create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => $password,
                    'email_verified_at' => now(),
                ]);
                $created++;
                $this->line("Created {$userData['email']}");

                continue;
            }

            if ($resetPassword) {
                $user->update([
                    'password' => $password,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
                $updated++;
                $this->line("Reset password for {$userData['email']}");
            }
        }

        if ($created === 0 && $updated === 0) {
            $this->info('All default admin users already exist. Use --reset-password to reset their passwords.');
        } else {
            $this->info("Done. Created: {$created}, passwords reset: {$updated}.");
            if ($created > 0 || $updated > 0) {
                $this->warn('Default password: '.$password);
            }
        }

        return self::SUCCESS;
    }
}
