<?php

namespace App\Http\Requests\Clients;

use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Phone/email uniqueness is scoped to the agency AND excludes soft-deleted
     * rows, so a trashed client's contact details can be reused by the next
     * customer. Everything else is plain shape validation.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $agencyId = app(AgencyContext::class)->id();

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => [
                'required', 'string', 'max:30',
                Rule::unique('clients', 'phone')->where(fn ($query) => $query
                    ->where('agency_id', $agencyId)
                    ->whereNull('deleted_at')),
            ],
            'secondary_phone' => ['nullable', 'string', 'max:30'],
            'email' => [
                'nullable', 'email', 'max:255',
                Rule::unique('clients', 'email')->where(fn ($query) => $query
                    ->where('agency_id', $agencyId)
                    ->whereNull('deleted_at')),
            ],

            'cin' => ['nullable', 'string', 'max:50'],
            'passport_number' => ['nullable', 'string', 'max:50'],
            'driving_license_number' => ['nullable', 'string', 'max:50'],
            'driving_license_expiry' => ['nullable', 'date'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:100'],

            'address' => ['nullable', 'string', 'max:2000'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:100'],

            'notes' => ['nullable', 'string', 'max:5000'],
            'source' => ['nullable', Rule::enum(ClientSource::class)],
            'status' => ['sometimes', Rule::enum(ClientStatus::class)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
