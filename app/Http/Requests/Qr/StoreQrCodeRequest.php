<?php

namespace App\Http\Requests\Qr;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQrCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * A poster advertises at most 24 vehicles — the same cap the public
     * landing applies when a scanned selection is fetched.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],

            'car_ids' => ['required', 'array', 'min:1', 'max:24'],
            'car_ids.*' => [
                'required', 'integer',
                Rule::exists('cars', 'id')->where('agency_id', $this->user()?->agency_id),
            ],
        ];
    }
}
