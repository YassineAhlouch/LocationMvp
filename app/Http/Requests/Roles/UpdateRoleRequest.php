<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
        $role = $this->route('role');

        return [
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role)],
            'permissions' => [
                'sometimes', 'array', 'min:1',
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
