<?php

namespace App\Enums;

enum ClientSource: string
{
    case Facebook = 'facebook';
    case Whatsapp = 'whatsapp';
    case Referral = 'referral';
    case Phone = 'phone';
    case WalkIn = 'walk_in';
    case Other = 'other';
}
