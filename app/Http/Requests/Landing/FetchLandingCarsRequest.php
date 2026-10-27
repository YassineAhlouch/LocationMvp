<?php

namespace App\Http\Requests\Landing;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Public query for the cars advertised on a printed QR code. A code either
 * encodes a saved poster page — /r/{qr_slug} — or an ad-hoc selection —
 * /r?cars={car_slug,car_slug}. Vehicle ids never appear in printed links;
 * what reaches the public is the slug each poster/car was given.
 */
class FetchLandingCarsRequest extends FormRequest
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
        $slug = '[a-z0-9]+(?:-[a-z0-9]+)*';

        return [
            'cars' => [
                'required_without:qr',
                'string',
                'regex:/^'.$slug.'(?:,'.$slug.')*$/',
            ],
            'qr' => [
                'required_without:cars',
                'string',
                'regex:/^'.$slug.'$/',
            ],
        ];
    }

    /**
     * The parsed, de-duplicated car slugs (capped — a QR can only carry a
     * handful of vehicles and this bounds the public query).
     *
     * @return array<int, string>
     */
    public function carSlugs(): array
    {
        return array_slice(
            array_values(array_unique(explode(',', (string) $this->string('cars')))),
            0,
            24,
        );
    }
}
