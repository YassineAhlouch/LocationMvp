<?php

namespace App\Enums;

/**
 * Dashboard KPI drill-downs: every case is a card on the dashboard and the
 * {metric} slug of /api/v1/dashboard/kpi/{metric}.
 *
 * The slug list is mirrored by the frontend registry
 * (frontend/src/views/location/kpi/registry.tsx) — change both together.
 */
enum KpiMetric: string
{
    case NetRevenue = 'net-revenue';
    case Expenses = 'expenses';
    case Reservations = 'reservations';
    case Occupancy = 'occupancy';
    case Outstanding = 'outstanding';
    case Today = 'today';
    case FleetAttention = 'fleet-attention';
    case NewClients = 'new-clients';
}
