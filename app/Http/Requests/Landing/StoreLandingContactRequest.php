<?php

namespace App\Http\Requests\Landing;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Public "open my agency account" submission from the landing home: a lead
 * for the team to contact and onboard as an agency dashboard account —
 * no agency record is created from this request.
 */
class StoreLandingContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'agency_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
