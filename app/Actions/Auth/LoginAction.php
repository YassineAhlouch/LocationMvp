<?php

namespace App\Actions\Auth;

use App\Exceptions\AccountDisabledException;
use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use App\Services\Activity\LogsActivity;
use App\Services\Auth\TokenService;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Hash;

class LoginAction
{
    use LogsActivity;

    public function __construct(private readonly TokenService $tokens) {}

    /**
     * Authenticate staff, record the login, and issue a scoped token.
     *
     * @param  array{email: string, password: string, device_name?: string}  $data
     * @return array{user: User, token: string, expires_at: CarbonInterface}
     */
    public function handle(array $data): array
    {
        $user = User::query()
            ->where('email', $data['email'])
            ->with('role')
            ->first();

        if ($user === null || ! Hash::check($data['password'], $user->password)) {
            // Unknown emails have no entity to attach to (the morph target is
            // mandatory) — known users with a bad password are always logged.
            if ($user !== null) {
                $this->logActivity('auth', 'login_failed', $user, $user, 'Invalid password supplied.');
            }

            throw new InvalidCredentialsException;
        }

        if (! $user->is_active) {
            $this->logActivity('auth', 'login_failed', $user, $user, 'Sign-in blocked — account disabled.');

            throw new AccountDisabledException;
        }

        $user->forceFill(['last_login_at' => now()])->save();

        $issued = $this->tokens->issue($user, $data['device_name'] ?? 'crm-web');

        $this->logActivity(
            'auth',
            'login',
            $user,
            $user,
            'Signed in via '.($data['device_name'] ?? 'crm-web'),
        );

        return [
            'user' => $user,
            'token' => $issued['token'],
            'expires_at' => $issued['expires_at'],
        ];
    }
}
