<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Auth\LoginAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\Activity\LogsActivity;
use App\Services\Auth\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use LogsActivity;

    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $result = $action->handle($request->validated());

        return response()->json([
            'token' => $result['token'],
            'expires_at' => $result['expires_at']->toIso8601String(),
            'user' => new UserResource($result['user']),
        ]);
    }

    public function logout(Request $request, TokenService $tokens): JsonResponse
    {
        $user = $request->user();
        $tokens->revokeCurrent($user);

        $this->logActivity('auth', 'logout', $user, $user, 'Signed out.');

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user()->load(['role', 'agency']));
    }
}
