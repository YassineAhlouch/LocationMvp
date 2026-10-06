<?php

namespace App\Enums;

enum ClientStatus: string
{
    case Normal = 'normal';
    case Vip = 'vip';
    case Blacklist = 'blacklist';

    public function isBlacklisted(): bool
    {
        return $this === self::Blacklist;
    }
}
