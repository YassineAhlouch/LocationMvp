<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Permission catalog
    |--------------------------------------------------------------------------
    | Single source of truth for module.verb permissions. The roles table
    | stores grants as JSON referencing these entries: an exact grant
    | ('reservations.create'), a module wildcard ('reservations.*'), or '*'
    | for the admin role. Sanctum token abilities are expanded from this
    | catalog at login time.
    */

    'dashboard' => ['view'],

    'reservations' => ['view', 'create', 'update', 'confirm', 'activate', 'complete', 'cancel', 'delete'],

    'clients' => ['view', 'create', 'update', 'delete'],

    'fleet' => ['view', 'create', 'update', 'delete'],

    'extras' => ['view', 'manage'],

    'pricing' => ['view', 'manage'],

    'payments' => ['view', 'create', 'refund'],

    'expenses' => ['view', 'create', 'update'],

    'reports' => ['view'],

    'activity_logs' => ['view'],

    'users' => ['view', 'create', 'update'],

    'roles' => ['view', 'manage'],

    'notifications' => ['view', 'send'],
];
