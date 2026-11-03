<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'full_name',
    'agency_name',
    'phone',
    'email',
    'message',
])]
class LandingContact extends Model
{
    use HasFactory;
}
