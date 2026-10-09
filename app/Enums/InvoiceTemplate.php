<?php

namespace App\Enums;

enum InvoiceTemplate: string
{
    case Classic = 'classic';
    case Atlas = 'atlas';

    public function label(): string
    {
        return match ($this) {
            self::Classic => 'Classic (letterhead)',
            self::Atlas => 'Atlas (bilingual FR/AR)',
        };
    }
}
