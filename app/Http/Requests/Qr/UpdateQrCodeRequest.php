<?php

namespace App\Http\Requests\Qr;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQrCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Renaming re-derives the slug (see QrCode::booted), so a poster printed
     * under the old name needs reprinting — same trade-off the name-as-slug
     * contract implies.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:120'],

            'car_ids' => ['sometimes', 'array', 'min:1', 'max:24'],
            'car_ids.*' => [
                'required', 'integer',
                Rule::exists('cars', 'id')->where('agency_id', $this->user()?->agency_id),
            ],
        ];
    }
}
