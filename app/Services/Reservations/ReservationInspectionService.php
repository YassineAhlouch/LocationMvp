<?php

namespace App\Services\Reservations;

use App\Enums\ReservationInspectionType;
use App\Models\Reservation;
use App\Models\ReservationInspection;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Persists the optional car condition snapshot captured alongside a
 * reservation transition: the handover inspection on activate and the return
 * inspection on complete. Kept out of the action classes so the area
 * normalisation and photo storage rules live in one place.
 */
class ReservationInspectionService
{
    private const PHOTO_DIRECTORY = 'inspections';

    /**
     * A phase with no areas, notes or photos is not an inspection — the
     * feature is optional, so an empty submission is simply skipped.
     *
     * @param  array{condition_notes?: string|null, areas?: array<string, mixed>, photos?: array<int, array{area?: string, file?: UploadedFile|null}>}  $data
     */
    public function record(
        Reservation $reservation,
        ReservationInspectionType $type,
        array $data,
        ?User $actor = null,
    ): ?ReservationInspection {
        $areas = $this->normaliseAreas($data['areas'] ?? []);
        $notes = $this->normaliseNotes($data['condition_notes'] ?? null);
        $photos = $this->validPhotos($data['photos'] ?? []);

        if ($areas === [] && $notes === null && $photos === []) {
            return null;
        }

        $isPickup = $type === ReservationInspectionType::Pickup;

        $inspection = $reservation->inspections()->updateOrCreate(
            ['type' => $type->value],
            [
                'mileage' => $isPickup ? $reservation->pickup_mileage : $reservation->return_mileage,
                'fuel_level' => $isPickup ? $reservation->pickup_fuel_level : $reservation->return_fuel_level,
                'condition_notes' => $notes,
                'areas' => $areas !== [] ? $areas : null,
                'inspected_by' => $actor?->id,
                'inspected_at' => now(),
            ],
        );

        $this->replacePhotos($inspection, $photos);

        return $inspection->load('photos', 'inspector');
    }

    /**
     * @param  array<string, mixed>  $areas
     * @return array<string, array{condition: string, notes: string|null}>
     */
    private function normaliseAreas(array $areas): array
    {
        $normalised = [];

        foreach ($areas as $area => $value) {
            if (! is_string($area) || ! is_array($value)) {
                continue;
            }

            $condition = $value['condition'] ?? null;

            if ($condition === null || $condition === '') {
                continue;
            }

            $normalised[$area] = [
                'condition' => (string) $condition,
                'notes' => $this->normaliseNotes($value['notes'] ?? null),
            ];
        }

        return $normalised;
    }

    private function normaliseNotes(?string $notes): ?string
    {
        $notes = is_string($notes) ? trim($notes) : null;

        return $notes === '' ? null : $notes;
    }

    /**
     * @param  array<int, mixed>  $photos
     * @return array<int, array{area: string, file: UploadedFile}>
     */
    private function validPhotos(array $photos): array
    {
        $valid = [];

        foreach ($photos as $photo) {
            if (! is_array($photo) || ! isset($photo['area'], $photo['file'])) {
                continue;
            }

            if (! is_string($photo['area']) || ! $photo['file'] instanceof UploadedFile) {
                continue;
            }

            $valid[] = ['area' => $photo['area'], 'file' => $photo['file']];
        }

        return $valid;
    }

    /**
     * @param  array<int, array{area: string, file: UploadedFile}>  $photos
     */
    private function replacePhotos(ReservationInspection $inspection, array $photos): void
    {
        if ($photos === []) {
            return;
        }

        foreach ($inspection->photos as $existing) {
            Storage::disk('public')->delete($this->relativePath($existing->image));
        }

        $inspection->photos()->delete();

        foreach ($photos as $photo) {
            $path = $photo['file']->store(self::PHOTO_DIRECTORY, 'public');

            $inspection->photos()->create([
                'area' => $photo['area'],
                'image' => '/storage/'.$path,
            ]);
        }
    }

    private function relativePath(string $image): string
    {
        return (string) preg_replace('#^/storage/#', '', $image);
    }
}
