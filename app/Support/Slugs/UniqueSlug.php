<?php

namespace App\Support\Slugs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * Builds the URL-safe machine name printed inside QR code links — derived
 * from a human label (a car's plate, a poster's name) the first time only.
 * Collisions are resolved by appending suffixes, never by touching an
 * already-assigned slug, so code printed on paper keeps resolving forever.
 * Uniqueness includes soft-deleted rows, which keep their slug behind them.
 */
final class UniqueSlug
{
    /**
     * The source is normalized exactly like the frontend preview (ASCII
     * slug); unreadable sources fall back to a stable base.
     */
    public static function make(Model $model, string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);

        if ($base === '') {
            $base = 'slug';
        }

        $slug = $base;
        $attempt = 2;

        while (self::taken($model, $slug, $ignoreId)) {
            $slug = $base.'-'.$attempt++;
        }

        return $slug;
    }

    private static function taken(Model $model, string $slug, ?int $ignoreId): bool
    {
        $query = $model->newQuery()->where('slug', $slug);

        if (in_array(SoftDeletes::class, class_uses_recursive($model), true)) {
            $query->withTrashed();
        }

        if ($ignoreId !== null) {
            $query->whereKeyNot($ignoreId);
        }

        return $query->exists();
    }
}
