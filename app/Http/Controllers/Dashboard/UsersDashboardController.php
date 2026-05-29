<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UsersDashboardController extends Controller
{
    private function authorizeUserManagement(): void
    {
        $user = auth()->user();
        abort_unless($user && $user->canManageUsers(), 403);
    }

    public function index()
    {
        $this->authorizeUserManagement();

        $users = User::query()
            ->orderByDesc('id')
            ->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('dashboard/users', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $this->authorizeUserManagement();

        return Inertia::render('dashboard/users-create');
    }

    public function store(Request $request)
    {
        $this->authorizeUserManagement();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'email_verified_at' => now(),
        ]);

        return redirect()
            ->route('dashboard.users.index')
            ->with('status', 'User created.');
    }

    public function edit(User $user)
    {
        $this->authorizeUserManagement();

        return Inertia::render('dashboard/users-edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorizeUserManagement();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
        ]);

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (! empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        $user->update($payload);

        return redirect()
            ->route('dashboard.users.index')
            ->with('status', 'User updated.');
    }

    public function destroy(User $user)
    {
        $this->authorizeUserManagement();

        if ($user->id === auth()->id()) {
            return redirect()
                ->route('dashboard.users.index')
                ->withErrors([
                    'delete' => 'You cannot delete your own account.',
                ]);
        }

        $user->delete();

        return redirect()
            ->route('dashboard.users.index')
            ->with('status', 'User deleted.');
    }
}

