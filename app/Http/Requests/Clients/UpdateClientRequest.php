<?php

namespace App\Http\Requests\Clients;

use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Same shape as creation, but the unique rules ignore the client being
     * edited (a PATCH touching phone must not collide with itself).
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $client = $this->route('client');
        $agencyId = $client?->agency_id ?? app(AgencyContext::class)->id();

        $unique = fn (string $column) => Rule::unique('clients', $column)
            ->ignore($client)
            ->where(fn ($query) => $query
                ->where('agency_id', $agencyId)
                ->whereNull('deleted_at'));

        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:30', $unique('phone')],
            'secondary_phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255', $unique('email')],

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
