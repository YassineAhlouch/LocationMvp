<?php

namespace App\Models;

use App\Models\Concerns\BelongsToAgency;
use App\Support\Slugs\UniqueSlug;
use Database\Factories\QrCodeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'agency_id',
    'name',
])]
class QrCode extends Model
{
    /** @use HasFactory<QrCodeFactory> */
    use BelongsToAgency, HasFactory;

    protected static function booted(): void
    {
        /**
         * Same contract as the car plate slug: the slug is derived from the
         * human name and only ever re-derived when that name changes — a
         * printed poster keeps opening its own page.
         */
        static::creating(function (self $qr): void {
            if ($qr->getAttribute('slug') === null) {
                $qr->setAttribute('slug', UniqueSlug::make($qr, (string) $qr->name));
            }
        });

        static::updating(function (self $qr): void {
            if ($qr->isDirty('name')) {
                $qr->setAttribute(
                    'slug',
                    UniqueSlug::make($qr, (string) $qr->name, (int) $qr->getKey()),
                );
            }
        });
    }

    /** The fleet the poster advertises; the landing filters to rentable cars. */
    public function cars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class)->withTimestamps();
    }
}
