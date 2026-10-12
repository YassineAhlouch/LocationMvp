<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Exceptions\AccountDisabledException;
use App\Exceptions\InvalidCredentialsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\LoginRequest;
use App\Http\Resources\PlatformAdminResource;
use App\Models\PlatformAdmin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Authentication for the platform (parent) dashboard. Entirely separate from
 * the agency staff login: different table, different token holder, and every
 * token is issued the wildcard ability.
 */
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $admin = PlatformAdmin::query()->where('email', $data['email'])->first();

        if ($admin === null || ! Hash::check($data['password'], $admin->password)) {
            throw new InvalidCredentialsException;
        }

        if (! $admin->is_active) {
            throw new AccountDisabledException;
        }

        $expiresAt = now()->addDays((int) config('auth.token_ttl_days', 7));

        $token = $admin->createToken($data['device_name'] ?? 'platform', ['*'], $expiresAt);

        $admin->update(['last_login_at' => now()]);

        return response()->json([
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at?->toIso8601String(),
            'user' => new PlatformAdminResource($admin),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $accessToken = $request->user()->currentAccessToken();

        if ($accessToken instanceof PersonalAccessToken) {
            $accessToken->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): PlatformAdminResource
    {
        return new PlatformAdminResource($request->user());
    }
}
