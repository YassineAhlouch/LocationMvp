<?php

namespace App\Http\Requests\Activity;

use Illuminate\Foundation\Http\FormRequest;

class IndexActivityLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Exact-match filters over the activity feed; the query service owns
     * the SQL. Tenancy is applied by the model's global scope, never here.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'module' => ['sometimes', 'string', 'max:50'],
            'action' => ['sometimes', 'string', 'max:50'],
            'user_id' => ['sometimes', 'integer'],
            'entity_type' => ['sometimes', 'string', 'max:255'],
            'entity_id' => ['sometimes', 'integer'],
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
