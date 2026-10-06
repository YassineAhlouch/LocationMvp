<?php

namespace App\Http\Requests\Notifications;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:5000'],
            'send_to_all' => ['sometimes', 'boolean'],
            'user_ids' => ['sometimes', 'array', 'min:1', 'max:200'],
            'user_ids.*' => [
                'integer',
                function ($attribute, $value, $fail): void {
                    // Agency scope + SoftDeletes ride User::whereKey, so a
                    // foreign or retired user can never receive agency mail.
                    if (! User::whereKey($value)->exists()) {
                        $fail('The selected user is invalid.');
                    }
                },
            ],
            'role_ids' => ['sometimes', 'array', 'min:1'],
            'role_ids.*' => ['integer', Rule::exists('roles', 'id')],
        ];
    }

    /**
     * Exactly one audience shape must be chosen — announcements have no
     * silent default, because "who did this go to" must never be ambiguous.
     *
     * @return array<string, \Closure>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $audience = collect([
                    'send_to_all' => $this->boolean('send_to_all'),
                    'user_ids' => $this->has('user_ids'),
                    'role_ids' => $this->has('role_ids'),
                ])->filter()->keys();

                if ($audience->count() !== 1) {
                    $validator->errors()->add(
                        'audience',
                        'Exactly one of send_to_all, user_ids, or role_ids is required.',
                    );
                }
            },
        ];
    }
}
