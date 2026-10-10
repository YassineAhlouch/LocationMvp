<?php

use App\Console\Commands\MarkOverdueInstallments;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Car-financing sweep: a pending "traite" past its due date becomes overdue.
Schedule::command(MarkOverdueInstallments::class)->daily();
