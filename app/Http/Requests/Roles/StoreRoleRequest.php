<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Grants reference the config/permissions.php catalog: an exact
     * module.verb, a module wildcard (module.*), or '*' for the master role.
     * Anything else is rejected so the role editor can never store garbage.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')],
            // Presentation metadata only — the frontend maps icon/color keys
            // to components and falls back to a default for unknown ones.
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:50'],
            'color' => ['sometimes', 'nullable', 'string', 'max:50'],
            'permissions' => [
                'required', 'array', 'min:1',
                function ($attribute, $value, $fail): void {
                    $catalog = config('permissions', []);

                    foreach ($value as $grant) {
                        if (! is_string($grant) || $grant === '') {
                            $fail('Each permission must be a non-empty string.');

                            return;
                        }

                        if ($grant === '*') {
                            continue;
                        }

                        $parts = explode('.', $grant);

                        if (count($parts) !== 2) {
                            $fail('Invalid permission "'.$grant.'". Expected module.verb, module.*, or *.');

                            return;
                        }

                        [$module, $verb] = $parts;

                        if (! isset($catalog[$module])) {
                            $fail('Unknown permission module "'.$module.'".');

                            return;
                        }

                        if ($verb !== '*' && ! in_array($verb, $catalog[$module], true)) {
                            $fail('Unknown permission "'.$grant.'".');

                            return;
                        }
                    }
                },
            ],
            'permissions.*' => ['string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
