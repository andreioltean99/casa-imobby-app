<?php

namespace Tests\Feature;

use App\Console\Commands\EnsureAdminUsersCommand;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnsureAdminUsersCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_creates_default_admin_users(): void
    {
        $this->assertSame(0, User::count());

        $this->artisan('admin:ensure-users')
            ->assertSuccessful();

        $this->assertSame(3, User::count());
        $this->assertDatabaseHas('users', ['email' => 'admin@casa-imobby.ro']);
    }

    public function test_command_can_reset_password_for_existing_admin(): void
    {
        User::factory()->create([
            'email' => 'admin@casa-imobby.ro',
            'password' => 'old-password',
        ]);

        $this->artisan('admin:ensure-users', ['--reset-password' => true])
            ->assertSuccessful();

        $this->assertTrue(
            auth()->attempt([
                'email' => 'admin@casa-imobby.ro',
                'password' => EnsureAdminUsersCommand::defaultPassword(),
            ])
        );
    }
}
