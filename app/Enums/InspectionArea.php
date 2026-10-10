<?php

namespace App\Enums;

/**
 * The sides/parts of the car a rental inspection walks through. Kept as a
 * fixed vocabulary so the same keys drive the checklist, the photo gallery
 * and the printed contract diagram.
 */
enum InspectionArea: string
{
    case Front = 'front';
    case Rear = 'rear';
    case Left = 'left';
    case Right = 'right';
    case Interior = 'interior';
    case Dashboard = 'dashboard';

    public function label(): string
    {
        return match ($this) {
            self::Front => 'Front',
            self::Rear => 'Rear',
            self::Left => 'Left side',
            self::Right => 'Right side',
            self::Interior => 'Interior',
            self::Dashboard => 'Dashboard',
        };
    }
}
