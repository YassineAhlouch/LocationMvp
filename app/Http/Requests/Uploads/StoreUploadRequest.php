<?php

namespace App\Http\Requests\Uploads;

use Illuminate\Foundation\Http\FormRequest;

class StoreUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Uploads are gallery assets (e.g. a car's photos) — keep to web image
     * formats and a sane size cap; the public disk serves them back.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }
}
