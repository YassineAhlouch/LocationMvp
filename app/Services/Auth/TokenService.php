<?php

namespace App\Services\Auth;

use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class TokenService
{
    /**
     * Issue an API token whose abilities mirror the user's permissions.
     *
     * @return array{token: string, expires_at: CarbonInterface}
     */
    public function issue(User $user, string $deviceName): array
    {
        $expiresAt = now()->addDays((int) config('auth.token_ttl_days', 7));

        $token = $user->createToken(
            $deviceName,
            $user->expandedPermissions(),
            $expiresAt,
        );

        return [
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
        ];
    }

    /**
     * Revokes the token used for the current request. Transient tokens
     * (from actingAs in tests) are ignored.
     */
    public function revokeCurrent(?User $user): void
    {
        $accessToken = $user?->currentAccessToken();

        if ($accessToken instanceof PersonalAccessToken) {
            $accessToken->delete();
        }
    }
}
