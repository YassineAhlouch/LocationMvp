<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateAvatarRequest;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Self-service account settings: every signed-in staff member reads and edits
 * their own profile, avatar and password. Nothing here is permission-gated —
 * the actor can only ever touch the record behind their own token.
 */
class ProfileController extends Controller
{
    use LogsActivity;

    public function show(Request $request): UserResource
    {
        return new UserResource($request->user()->load(['role', 'agency']));
    }

    public function update(UpdateProfileRequest $request): UserResource
    {
        $user = $request->user();
        $validated = $request->validated();
        $keys = array_keys($validated);

        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $user->getAttribute($key)])->all();

        $user->fill($validated);
        $user->save();

        $this->logActivity(
            'users',
            'updated',
            $user,
            $user,
            'Profile updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $user->getAttribute($key)])->all(),
        );

        return new UserResource($user->load(['role', 'agency']));
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        // The 'hashed' cast turns the plain value into a bcrypt digest on save.
        $user->password = $request->validated('password');
        $user->save();

        // The hash is a derived secret, so it never appears in the diff — the
        // description alone records that the credentials rotated.
        $this->logActivity('users', 'updated', $user, $user, 'Password changed');

        return response()->json(['message' => 'Password updated.']);
    }

    public function updateAvatar(UpdateAvatarRequest $request): UserResource
    {
        $user = $request->user();
        $previous = $user->avatar;

        $path = $request->file('file')->store('avatars', 'public');

        $user->update(['avatar' => '/storage/'.$path]);

        $this->logActivity(
            'users',
            'updated',
            $user,
            $user,
            'Profile photo updated',
            ['avatar' => $previous],
            ['avatar' => $user->avatar],
        );

        return new UserResource($user->load(['role', 'agency']));
    }
}
