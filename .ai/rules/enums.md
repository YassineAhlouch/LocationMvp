---
paths:
  - app/Enums/KpiMetric.php
---

# Enums

## Keep the KPI metric slug list in sync across the stack
App\Enums\KpiMetric is the canonical list of dashboard drill-down slugs (net-revenue, expenses, reservations, occupancy, outstanding, today, fleet-attention, new-clients). Adding or renaming a metric means updating four places together: the enum, ReportingService::kpiDetail()'s match, frontend/src/views/location/kpi/registry.tsx, and the KpiMetricKey union in frontend/src/@types/location.ts. Detail payloads reuse ReportingService::summary() period semantics so each page headline always ties back to its dashboard card.
