# CAR RENTAL MVP — PROJECT BIBLE

> **Purpose:** a complete, self-contained description of this repository's backend (database + functionality + API + conventions) so that another AI (or a new developer) can understand the project without reading the code.
>
> **Verified against:** Laravel 13.34 / PHP 8.4 / MySQL `locationmvp`, branch `main`.

---

## 0. What this is

A **multi-tenant car-rental SaaS**: a Laravel 13 API that serves **agency staff** (car fleet, clients, reservations, money) and a **platform admin** (subscribes agencies, bills them). Two React SPA frontends consume it, plus a marketing landing page.

**Repo root:** `/Users/mac/Desktop/LocationBackend/location`
**Remote:** `github.com/YassineAhlouch/LocationMvp` · **branch:** `main`

### Four apps in one repo

| Path | What it is | Port / entry |
|---|---|---|
| `app/`, `routes/`, `config/`, `database/` | **Laravel 13 API** (the whole backend) | `http://localhost:8000`, prefix `/api/v1` |
| `frontend/` | **Agency CRM SPA** (React 18 + Vite + TS + Tailwind v4) | `http://localhost:5173`, entry `/apps/dashboard` |
| `parent/` | **Platform admin SPA** (same stack, separate app) | `parent/` — manages agencies, currencies, invoices, platform users |
| `landing/` | **Marketing landing page** (React + Vite, i18n en/fr/ar) | static / Vite build |

The Laravel backend is the source of truth for all four.

---

## 1. Stack & runtime

- **PHP 8.4**, **Laravel 13.34**, **MySQL** (`locationmvp` @ `127.0.0.1:3306`, user `root`)
- **Laravel Sanctum** (bearer tokens, token abilities = the user's permissions)
- **Queue:** `database` · **Cache:** `database`
- Frontend: React 18, TypeScript, Vite, Tailwind **v4** (CSS-first: `src/assets/styles/tailwind/index.css` uses `@config '../../../../tailwind.config.ts'`), React Router v6 (`react-router`), i18next (`locales/lang/{en,fr,ar}.json`), Axios (`src/services/axios/AxiosBase.ts`)
- Tests: **PHPUnit** (`php artisan make:test --phpunit {Name}`), factories in `database/factories/`

### `.env` essentials

```
DB_CONNECTION=mysql
DB_DATABASE=locationmvp
APP_URL=http://localhost:8000
AUTH_TOKEN_TTL_DAYS=7
PRICING_TAX_RATE=0.20
PRICING_CURRENCY=MAD
PRICING_LATE_GRACE_MINUTES=60
```

---

## 2. MULTI-TENANCY — read this before touching any query

The tenant is the **agency**. Almost every business table has `agency_id`.

### The mechanism

`app/Support/Tenancy/AgencyContext.php` + `app/Models/Concerns/BelongsToAgency.php`:

1. `AgencyContext` is a **singleton** holding the current `agencyId`. It **never** falls back to `auth()` — that would recurse while the guard resolves the user through an agency-scoped query.
2. `ApplyAgencyScope` middleware sets it right after authentication.
3. Every tenant-owned model does `use BelongsToAgency` → a **global scope** appending `where agency_id = context()->id()`.
4. `EnsureAgencyCanWrite` blocks write operations when the agency is inactive (`agencies.is_active = 0`).
5. `EnsureActiveAccount` blocks disabled users (`users.is_active = 0`).
6. Jobs / console commands must wrap queries in `AgencyContext::with($agencyId, fn () => ...)`.

### Critical ordering rule

From `bootstrap/app.php`: `ApplyAgencyScope` is *prepended to the priority list before* `SubstituteBindings`, because route-model binding resolves before route middleware. If the context isn't set first, the global scope no-ops and route binding can leak another agency's row — a cross-tenant **200 instead of 404**.

### Platform API is fully separate

`/api/v1/platform/*` uses its own token holder (`PlatformAdmin`, table `platform_admins`), its own middleware (`EnsurePlatformAdmin`), and never inherits agency scoping. The two apps share models where it makes sense (currencies, invoice templates, brands / models / categories).

---

## 3. Database schema (complete)

Engine MySQL. All PKs `bigint unsigned`. Timestamps `created_at` / `updated_at` unless noted. `*` = soft-delete (`deleted_at`).

### 3.1 Tenant & identity

#### `agencies` — the tenant

| Column | Type | Notes |
|---|---|---|
| `id` | bigint | PK |
| `name` | varchar(255) | |
| `email`, `phone` | varchar(255) | |
| `ice` | varchar(255) | tax identifier |
| `rc` | varchar(255) | commercial register |
| `logo_path` | varchar(255) | |
| `daily_mileage_allowance` | smallint unsigned | default **250** km/day |
| `extra_mileage_fee_per_km` | decimal(8,2) | default **1.00** |
| `invoice_template_id` | bigint | → `invoice_templates.id` |
| `currency_id` | bigint | → `currencies.id` |
| `address` | text | |
| `city`, `country` | varchar(255) | |
| `is_active` | tinyint(1) | |
| timestamps | | |

#### `users` — agency staff *

`agency_id` → agencies · `role_id` → roles · `first_name` · `last_name` · `email` (**unique**) · `phone` · `password` · `address` (text) · `avatar` · `last_login_at` · `is_active` · timestamps · `deleted_at`

Indexes: `users_email_unique`, FK `agency_id`, FK `role_id`.

#### `roles` — global RBAC catalog

`name` (**unique**) · `description` · `icon` · `color` · **`permissions` longtext (JSON)** · `is_active` · timestamps

Grants are either an exact entry (`reservations.create`), a module wildcard (`reservations.*`), or `*` for admin.

#### `platform_admins` — platform operators (NOT agency users)

`name` · `email` (**unique**) · `password` · `is_active` · `last_login_at` · timestamps

#### `personal_access_tokens` — Sanctum

`tokenable_type` / `tokenable_id` · `name` (text) · `token` (unique, 64) · **`abilities` text (JSON = the user's expanded permissions)** · `last_used_at` · **`expires_at`** · timestamps

#### `currencies` — global

`code` (**unique**) · `name` · `symbol` · `decimals` · `is_active` · timestamps

#### `invoice_templates` — global

`slug` (**unique**) · `name` · `is_active` · timestamps

#### `agency_payments` — platform → agency subscription invoice

`agency_id` · `currency_id` · `amount` decimal(10,2) · `period` varchar(7) (`YYYY-MM`) · `due_date` date · `paid_at` timestamp · `reference` · `notes` · `recorded_by` → `platform_admins` · timestamps

**Status is DERIVED, never stored:** paid if `paid_at` is set, otherwise overdue once `due_date` has passed, otherwise pending.
Indexes: `(agency_id, due_date)`, `paid_at`.

### 3.2 Fleet

#### `brands`
`name` (**unique**) · timestamps

#### `car_models`
`brand_id` → brands · `name` · timestamps · unique `(brand_id, name)`

#### `car_categories`
`name` (**unique**) · `description` · timestamps

#### `cars` * (soft delete)

`agency_id` · `brand_id` · `model_id` · `category_id` · **`registration_number` unique** · **`vin` unique** · `year` smallint · `color` · `seats_count` tinyint · `doors_count` tinyint · `transmission_type` enum · `fuel_type` enum · **`daily_price` decimal(10,2)** (base daily rate) · `purchase_price` · `initial_mileage` · `current_mileage` · `current_fuel_level` tinyint · `insurance_company` · `insurance_policy_number` · `insurance_expiry_date` · `technical_inspection_expiry` · `next_service_mileage` · `last_maintenance_at` · **`status`** enum · `is_active` · `notes` text · timestamps

Indexes: `(agency_id, category_id)`, `(agency_id, status)`.

#### `car_images`
`car_id` · `image` · `is_primary` · `sort_order`

#### `car_financings`
`car_id` (**unique** — one financing per car) · `purchase_date` · `purchase_price` · `down_payment` · `financed_amount` · `installment_amount` · `installments_count` · `first_due_date` · `lender` · `notes` · timestamps

#### `car_installments`
`financing_id` · `car_id` · `installment_number` · `due_date` · `amount` · `paid_amount` · `paid_date` · `status` enum · `reference` · timestamps

Unique `(financing_id, installment_number)` · index `(car_id, status, due_date)`.

#### `car_expenses`
`agency_id` · `car_id` · `type` enum · `title` · `description` · `amount` decimal(10,2) · `vendor` · `start_date` · `due_date` · **`paid_date`** · `attachment` · `status` enum · `created_by` → users · timestamps

Indexes: `(agency_id, due_date)`, `(agency_id, status)`, `(car_id, type)`.

### 3.3 Clients

#### `clients` *

`agency_id` · `first_name` · `last_name` · `phone` · `secondary_phone` · `email` · **`cin`** (Moroccan national ID) · `passport_number` · `driving_license_number` · `driving_license_expiry` · `birth_date` · `birth_place` · `nationality` · `address` text · `city` · `country` · `notes` · `source` enum · `status` enum · `is_active` · **`last_reservation_at`** · timestamps

Indexes: `(agency_id, status)`, `phone`.

### 3.4 Reservations (the core)

#### `reservations`

| Group | Columns |
|---|---|
| Identity | `agency_id` · **`reservation_number`** unique (`RES-YYYYMMDD-XXXXX`) · `car_id` · `primary_client_id` · `secondary_client_id` |
| Driver snapshot | `primary_driver_name` · `primary_driver_phone` · `primary_driver_cin` · `primary_driver_passport` · `primary_driver_license` (+ the same six for `secondary_*`) |
| Trip | `pickup_location` · `return_location` · `pickup_datetime` · `expected_return_datetime` · `actual_return_datetime` · `pickup_mileage` · `return_mileage` · `pickup_fuel_level` · `return_fuel_level` |
| Money | **`daily_rate`** · **`rental_days`** · **`subtotal`** · **`discount_amount`** · `discount_reason` · **`tax_amount`** · **`deposit_amount`** · **`total_amount`** · **`payment_status`** enum |
| State | **`status`** enum · `remarks` text · `reported_issues` text · `created_by` · `approved_by` · timestamps |

Indexes: `(agency_id, pickup_datetime)` · `(agency_id, status)` · **`reservations_overlap_index (car_id, status, pickup_datetime, expected_return_datetime)`**

`reservation_number`, `rental_days`, `subtotal`, `tax_amount`, `total_amount`, `status`, `payment_status` and `approved_by` are **NOT fillable** — they are computed by the pricing engine and the state machine only.

Driver details are **snapshotted** onto the reservation so history survives later edits to the client record.

#### `reservation_extras`
`reservation_id` · `name` · `description` · `pricing_type` enum · `quantity` · `unit_price` · `total_price` · timestamps

#### `reservation_changes` — immutable audit of every business-meaningful change
`reservation_id` · `field_name` · `change_type` enum · `old_value` text · `new_value` text · `reason` text · `created_by` · `created_at`

Indexes: `(reservation_id, created_at)`, `(change_type, created_at)`.

#### `reservation_inspections`
`reservation_id` · `type` enum (pickup / return) · `mileage` · `fuel_level` · `condition_notes` text · **`areas` longtext (JSON: area → `{condition, notes}`)** · `inspected_by` · `inspected_at` · timestamps

Unique `(reservation_id, type)` — one pickup snapshot and one return snapshot per reservation.

#### `reservation_inspection_photos`
`reservation_inspection_id` · `area` · `image` · `notes` · timestamps

### 3.5 Money

#### `payments` — the reservation ledger

**Deposits are ordinary rows here**, not a special column.

`agency_id` · `reservation_id` · `payment_date` · `amount` decimal(10,2) · `method` enum · `reference` · **`status`** enum (pending / paid / refunded) · `notes` · `created_by` · timestamps

Indexes: `(agency_id, payment_date)`, `(agency_id, status)`.

### 3.6 Pricing & extras

#### `pricing_rules`
`agency_id` · `name` · `rule_type` enum (season / day_of_week) · `starts_on` · `ends_on` · **`days_of_week` longtext (JSON)** · `adjustment_type` enum (percent / fixed) · `adjustment_value` decimal(10,2) · `is_active` · timestamps

Index `(agency_id, is_active)`.

#### `extras`
`agency_id` · `name` · `description` · `pricing_type` enum (fixed / daily) · `default_price` · `is_active` · `sort_order` · timestamps · unique `(agency_id, name)`

### 3.7 Ops tables

#### `activity_logs`
`agency_id` · `user_id` · `module` · `entity_type` · `entity_id` · `action` · `description` text · `old_values` longtext (JSON) · `new_values` longtext (JSON) · `ip_address` · `user_agent` · `created_at`

Indexes: `(agency_id, created_at)`, `(entity_type, entity_id)`, `(module, action)`.

#### `notifications`
Laravel notifications table — `id` char(36) UUID · `type` · `notifiable_type` / `notifiable_id` · `data` text (JSON) · `read_at` · timestamps

#### Laravel infrastructure tables
`migrations` · `cache` · `cache_locks` · `jobs` · `job_batches` · `failed_jobs` · `sessions` · `password_reset_tokens`

---

## 4. Enums & state machines (`app/Enums/`)

```
CarStatus:            available | reserved | rented | maintenance | inactive
ReservationStatus:    pending | confirmed | reserved | active | completed | cancelled | no_show
PaymentStatus:        unpaid | partial | paid
PaymentRecordStatus:  pending | paid | refunded
PaymentMethod:        cash | card | transfer
ClientStatus:         normal | vip | blacklist
ClientSource:         facebook | whatsapp | referral | phone | walk_in | other
ExpenseType:          insurance | maintenance | repair | tax | oil_change | tires | inspection
ExpenseStatus:        pending | paid | overdue
InstallmentStatus:    pending | paid | overdue
FuelType:             diesel | petrol | hybrid | electric
TransmissionType:     manual | automatic
PricingType:          fixed | daily
PricingRuleType:      season | day_of_week
PricingAdjustmentType:percent | fixed
ReservationInspectionType: pickup | return
InspectionArea:       front | rear | left | right | interior | dashboard
InspectionCondition:  ok | minor | damage
ReservationChangeType:creation | status_change | extension | discount | date_change
                      | manual_edit | pricing_update | payment
```

### Reservation state machine

`ReservationStatus::canTransitionTo()`:

```
pending   → confirmed | reserved | cancelled | no_show
confirmed → active | cancelled | no_show
reserved  → confirmed | active | cancelled | no_show
active    → completed
completed | cancelled | no_show  →  (terminal)
```

- `blocking()` = `[pending, confirmed, reserved, active]` — these statuses **occupy a car** and are what availability checks count.
- `isTerminal()` = `[completed, cancelled, no_show]`.

---

## 5. Business logic (the rules that must not break)

### 5.1 Pricing engine

`app/Services/Pricing/PricingService.php` + `app/Services/Pricing/PricingRuleResolver.php`

One deterministic code path used by create / update / extend / late-complete **and** the dry-run quote endpoint — so a rule change always reaches all of them.

```
rate     = Σ per-day base rate adjusted by pricing_rules
           (percent points ADD, fixed amounts SUM — never compounded)
subtotal = rate − duration_discount + extras_total
total    = (subtotal − manual_discount) + tax
```

- `tax_rate` = `config('pricing.tax_rate')`, default **0.20** (Moroccan TVA). `PRICING_TAX_RATE=0` disables tax.
- `currency` = `config('pricing.currency')`, default **MAD**.
- Duration discount tiers (in `config/pricing.php`): **7 days → 5 %**, **28 days → 10 %**. The highest matching tier wins.
- **The duration discount folds into `subtotal`** so persisted columns always reconcile: `total = subtotal − discount_amount + tax_amount`.
- **`deposit_amount` is deliberately OUTSIDE the formula** — held funds, not revenue.
- `rental_days = diffInDays(pickup → return)` at day granularity.
- **Late return:** a return later than expected plus `pricing.late_grace_minutes` (60) is recharged for every extra calendar day held.

### 5.2 Availability

`app/Services/Reservations/AvailabilityService.php` + `Reservation::scopeOverlapping()`

- Booking windows are **half-open `[pickup, return)`**. A return at 10:00 and the next pickup at 10:00 do **not** collide — back-to-back rentals are legal.
- Overlap = same `car_id`, a blocking status, `pickup_datetime < requested_return` **and** `expected_return_datetime > requested_pickup`.
- **Race safety:** every availability check runs inside a transaction that has already taken `lockForUpdate()` on the car row, so two concurrent bookings for the same car serialize and the second sees the first.

### 5.3 Reservation lifecycle

`app/Actions/Reservations/` — `CreateReservationAction`, `UpdateReservationAction`, `ConfirmReservationAction`, `ActivateReservationAction`, `CompleteReservationAction`, `CancelReservationAction`, `NoShowReservationAction`, `ExtendReservationAction`.
Shared trait: `Concerns/InteractsWithReservationLifecycle.php`.

Discipline enforced by the trait:

1. **Lock order is always car → reservation**, never reversed, so concurrent actions on one fleet row serialize instead of deadlocking.
2. Under REPEATABLE READ the car lock is the transaction's first statement, pinning the consistent snapshot after any blocker's commit.
3. **Every business-meaningful write lands in `reservation_changes`.**
4. **Every status transition also lands in `activity_logs`.**
5. The car's own `status` is kept in sync (`reserved` / `rented` / `available`).

### 5.4 Payments

`app/Actions/Payments/` — `StorePaymentAction`, `ConfirmPaymentAction`, `RefundPaymentAction`, `DeletePaymentAction`; shared trait `Concerns/SyncsReservationPaymentStatus.php`.

- **Only the reservation row is locked** (payments never touch fleet state → no car lock → can never cycle with the car → reservation order used elsewhere).
- **`payment_status` is DERIVED, never hand-set:**
  - `unpaid` — paid sum = 0
  - `partial` — 0 < paid sum < total
  - `paid` — paid sum ≥ total
- Only rows with `status = paid` count. **Pending and refunded money never counts.**
- Every movement of the paid sum is written to `reservation_changes` with `change_type = payment`.
- Every money event (recorded / confirmed / refunded / deleted) is written to `activity_logs` with its actor.

### 5.5 Extras

`Concerns/StoresExtrasSnapshots` — extras are **snapshotted** onto the reservation (`reservation_extras` stores name, description, pricing_type, quantity, unit_price, total_price) so later catalog edits never rewrite historical totals.

### 5.6 Inspections

`app/Services/Reservations/ReservationInspectionService.php`

- Optional. Captured on **activate** (pickup inspection) and **complete** (return inspection).
- A submission with **no areas, no notes and no photos is skipped** (the method returns `null`) — the feature is optional.
- Areas are normalised to `area → {condition, notes}` JSON; conditions are `ok | minor | damage`.
- Photos are stored under the `inspections` storage directory.
- One inspection row per `(reservation_id, type)`, updated in place.
- Mileage and fuel are copied from the reservation at record time (the pickup row uses pickup values, the return row uses return values).

### 5.7 Contract / mileage

`app/Services/Reservations/ReservationContractService.php`

```
distance   = return_mileage − pickup_mileage   (null while the car is out — never invented)
allowance  = rental_days × agency.daily_mileage_allowance  (fallback 250 km/day)
excess     = max(0, distance − allowance)
extra_fee  = excess × agency.extra_mileage_fee_per_km      (fallback 1.00 per km)
```

### 5.8 Car lifecycle

`app/Services/Reservations/CarLifecycleService.php`

Car status follows the reservation: confirmed / reserved → `reserved`; active → `rented`; completed / cancelled / no_show → back to `available`. `maintenance` and `inactive` are manual states.

### 5.9 Financing

`app/Services/Cars/CarFinancingService.php`

- One financing per car (`car_financings.car_id` is unique).
- Creating a financing generates the full installment schedule: `installments_count` rows, each `amount = installment_amount`, `due_date` advancing from `first_due_date`.
- `markPaid()` sets `paid_amount`, `paid_date` and `status = paid` (only `pending` / `overdue` rows can be paid).
- The `MarkOverdueInstallments` console command flips pending installments past their `due_date` to `overdue` (scheduled in `routes/console.php`).

### 5.10 Expenses

`car_expenses`

- `status` reflects `paid_date`: paid if set, overdue if `due_date < today` and unpaid, otherwise pending.
- Expenses are **cash-basis** in reporting: revenue and expenses are both counted on **paid** records only.

### 5.11 Reporting math

`app/Services/Reports/ReportingService.php` — stated once, used everywhere:

- **Revenue is cash-basis:** paid payment records bucketed by `payment_date`. Pending and refunded amounts are reported separately and never mixed into "in".
- **Expenses are cash-basis too:** paid records by `paid_date`. Outstanding (pending) bills booked in the period are exposed as *exposure*.
- **Occupancy** counts one unit per "day a car is on hire" (`diffInDays` between pickup and return); the denominator is `fleet_cars × calendar days in the period`.
- All queries ride the `BelongsToAgency` global scope — no cross-agency leaks.

Endpoints: `dashboard/summary` (period-based), `reports/timeline` (monthly buckets), `reports/cars`, `reports/clients`.

### 5.12 Activity log

`app/Services/Activity/ActivityLogger.php` + the `LogsActivity` trait.

Every business mutation logs: module, entity type / id, action, a human description, an `old_values` / `new_values` JSON diff, the actor, the IP and the user agent. Read through `GET /api/v1/activity-logs` (filterable).

### 5.13 Notifications

`app/Services/Notifications/NotificationDispatcher.php`

Laravel notifications stored in `notifications` (UUID primary key). Read via `GET /api/v1/notifications`, `GET /api/v1/notifications/unread-count`, `POST /api/v1/notifications/read/{id}`, `POST /api/v1/notifications/read-all`; `POST /api/v1/notifications` sends manually.

### 5.14 Platform billing

`agency_payments` — the platform invoices an agency per period. `pay` / `unpay` endpoints toggle `paid_at`. Status is always derived so it cannot drift. The **agency** app reads its own subscription state through `GET /api/v1/subscription`.

---

## 6. API reference

### Public

| Method | Path | Notes |
|---|---|---|
| POST | `/api/v1/auth/login` | throttled 6/min per IP (`throttle:6,1`) on top of the global `throttle:api` |
| POST | `/api/v1/platform/auth/login` | platform admin login |

### Authenticated agency API — `/api/v1/*`

Every route inherits the group middleware `auth:sanctum` → `EnsureActiveAccount` → `ApplyAgencyScope` → `EnsureAgencyCanWrite`. Permission middleware is applied per route as `permission:module.verb`.

**Session / profile**
- `GET /auth/me` · `POST /auth/logout`
- `GET /profile` · `PATCH /profile` · `PATCH /profile/password` · `POST /profile/avatar`

**Agency & settings**
- `GET /agency` · `GET /subscription`
- `GET /invoice-templates` · `GET /agencies` · `PATCH /agencies/{agency}` · `GET /currencies` · `PATCH /settings/currency` — all `permission:settings.manage`

**Reservations**
- `GET /reservations` (paginated + filters) · `POST /reservations`
- `GET /reservations/{id}` · `PATCH /reservations/{id}`
- `GET /reservations/{id}/changes` · `GET /reservations/{id}/contract`
- `POST /reservations/{id}/confirm` · `/activate` · `/complete` · `/cancel` · `/no-show` · `/extend`
- `GET /reservations/availability` · `GET /reservations/car-availability` · `GET /reservations/calendar`
- `GET /reservation-changes`

**Pricing**
- `POST /pricing/quote` (dry-run quote with per-day breakdown)
- `GET /pricing/rules` · `POST /pricing/rules` · `GET /pricing/rules/{id}` · `PATCH /pricing/rules/{id}` · `DELETE /pricing/rules/{id}`

**Extras**
- `GET /extras`

**Payments**
- `GET /payments` (agency-wide ledger) · `GET /payments/overview`
- `GET /reservations/{id}/payments` · `POST /reservations/{id}/payments` · `DELETE /reservations/{id}/payments/{payment}`
- `POST /payments/{payment}/confirm` · `POST /payments/{payment}/refund`

**Clients**
- `GET /clients` · `POST /clients` · `GET /clients/{id}` · `PATCH /clients/{id}` · `DELETE /clients/{id}`

**Cars & fleet**
- `GET /cars` · `POST /cars` · `GET /cars/{id}` · `PATCH /cars/{id}` · `DELETE /cars/{id}`
- `GET /cars/{id}/overview` · `GET /cars/{id}/history` · `GET /cars/{id}/statistics`
- `POST /uploads` — `permission:fleet.update`
- `POST /cars/{id}/financing` · `PATCH /cars/{id}/financing` · `DELETE /cars/{id}/financing` · `POST /cars/{id}/installments/{installment}/pay` — `permission:financing.manage`
- `GET /cars/{id}/statistics` — `permission:financing.view`
- `fleet/brands`, `fleet/models`, `fleet/categories` — full CRUD (`fleet.view|create|update|delete`)

**Expenses**
- `GET /expenses` · `POST /expenses` · `GET /expenses/{id}` · `PATCH /expenses/{id}`

**Users & roles**
- `GET /users` · `POST /users` · `GET /users/{id}` · `PATCH /users/{id}`
- `GET /roles` · `GET /roles/permissions` · `POST /roles` · `GET /roles/{id}` · `PATCH /roles/{id}`

**Dashboard & reports**
- `GET /dashboard/summary` · `GET /reports/timeline` · `GET /reports/cars` · `GET /reports/clients`

**Notifications**
- `GET /notifications` · `GET /notifications/unread-count` · `POST /notifications/read/{id}` · `POST /notifications/read-all` · `POST /notifications`

**Activity**
- `GET /activity-logs` · `GET /activity-logs/{id}`

### Platform API — `/api/v1/platform/*`

`auth:sanctum` (PlatformAdmin) + `EnsurePlatformAdmin`. Never agency-scoped.

- `GET /auth/me` · `POST /auth/logout`
- `GET /agencies` · `POST /agencies` · `GET /agencies/{id}` · `PATCH /agencies/{id}`
- `GET /dashboard/stats`
- `GET /agency-payments` · `POST /agency-payments` · `GET /agency-payments/{id}` · `PATCH /agency-payments/{id}` · `DELETE /agency-payments/{id}` · `POST /agency-payments/{id}/pay` · `POST /agency-payments/{id}/unpay`
- `GET /invoices`
- `GET /invoice-templates`
- `GET /users` · `POST /users` · `GET /users/{id}` · `PATCH /users/{id}`
- `GET /roles`
- `GET /fleet/brands` (+ models, categories)

### Error format

All API errors are JSON with a **stable machine-readable `code`**, so the React client branches on `code` and never on human-readable message text:

| Situation | Status | Body |
|---|---|---|
| Domain exception | the exception's own status | `{message, code, ...context}` (e.g. `car_unavailable` → 409) |
| `PermissionDeniedException` | 403 | `{message, code: "forbidden", permission}` |
| `AccountDisabledException` | 403 | `{message, code: "account_disabled"}` |
| `InvalidCredentialsException` | 401 | `{message, code: "invalid_credentials"}` |

Rendering is configured in `bootstrap/app.php` → `withExceptions()`.

---

## 7. Auth & tokens

- `POST /api/v1/auth/login` → `LoginAction` → `TokenService::issue()`.
- The token is a Sanctum personal access token whose **abilities are the user's expanded permissions** (exact grants + module wildcards + `*`), so the SPA can hide UI the API would reject anyway.
- TTL = `config('auth.token_ttl_days')` → 7 days (env `AUTH_TOKEN_TTL_DAYS`).
- `POST /auth/logout` revokes the current token (transient `actingAs` tokens used in tests are ignored).
- The global rate limiter `throttle:api` is defined in `AppServiceProvider` and keyed per bearer token when present — throttling runs before `auth:sanctum`, so the token is the earliest stable identity available.
- The SPA stores the token in `localStorage` (`app.config.accessTokenPersistStrategy`) and sends `Authorization: Bearer …` through `frontend/src/services/axios/AxiosBase.ts`.

---

## 8. Roles & permissions matrix

The catalog lives in `config/permissions.php` (single source of truth). Seeded by `database/seeders/RoleSeeder.php`.

| Permission | admin | manager | agent |
|---|---|---|---|
| `*` | ✅ | | |
| `dashboard.*` / `dashboard.view` | ✅ | ✅ | ✅ view |
| `reservations.*` | ✅ | ✅ | view, create, update, confirm, activate, complete, cancel |
| `clients.*` | ✅ | ✅ | view, create, update |
| `fleet.*` | ✅ | ✅ | view |
| `extras.*` | ✅ | ✅ | view |
| `pricing.*` | ✅ | ✅ | view |
| `payments.*` | ✅ | ✅ | view, create |
| `expenses.*` | ✅ | ✅ | |
| `financing.*` | ✅ | ✅ | |
| `reports.*` | ✅ | ✅ | |
| `activity_logs.*` | ✅ | ✅ | |
| `notifications.*` | ✅ | ✅ | |
| `users.view` | ✅ | ✅ | |
| `roles.*`, `settings.*` | ✅ | | |

### Full permission catalog

```
dashboard.view
reservations.view | reservations.create | reservations.update | reservations.confirm
                | reservations.activate | reservations.complete | reservations.cancel | reservations.delete
clients.view    | clients.create    | clients.update    | clients.delete
fleet.view      | fleet.create      | fleet.update      | fleet.delete
extras.view     | extras.manage
pricing.view    | pricing.manage
payments.view   | payments.create   | payments.refund
expenses.view   | expenses.create   | expenses.update
financing.view  | financing.manage
reports.view
activity_logs.view
users.view      | users.create      | users.update
roles.view      | roles.manage
settings.manage
notifications.view | notifications.send
```

---

## 9. Frontend apps

### `frontend/` — agency CRM (port 5173)

- **Routing:** `src/configs/routes.config/*.ts` + `src/components/route/AllRoutes.tsx`. The entry path `/apps/dashboard` maps to `src/views/location/LocationDashboard.tsx`, lazy-loaded in `appsRoute.ts`.
- **API layer:** `src/services/LocationService.ts` — **every export maps 1:1 to a Laravel route** (`apiGetDashboardSummary`, `apiCreateReservation`, `apiGetCarOverview`, …). Responses are unwrapped by `ApiService`, so list endpoints resolve to `{ data: [], meta: {...} }`.
- **Types:** `src/@types/location.ts`.
- **Screens** (`src/views/location/`): Dashboard · Reservations + NouvelleReservation / EditReservation · ReservationCalendar · ReservationHistory · ReservationInvoice (print) · ContractAtlas (print contract) · Cars + CarDetails (overview / history / statistics / financing / expenses / reservations) · CarInspection · Clients · Payments · Expenses · Users · Roles · ActivityLogs · Notifications · Settings (currency, invoice template) · Reports.
- **i18n:** `src/locales/lang/{en,fr,ar}.json`.
- **Theme:** Tailwind v4 CSS-first. The gray scale and `primary` / `error` / `success` / `info` / `warning` are CSS variables in `src/assets/styles/tailwind/index.css`.

### `parent/` — platform admin

- `src/views/platform/`: Dashboard (stats) · Agencies · Payments · Invoices · Users · Roles · Currencies · Brands · CarModels · CarCategories.
- API layer: `src/services/PlatformService.ts`.
- It shares the component kit with `frontend/` (`StatisticCard`, `IconFrame`, `GrowShrinkTag`, `DataTable`, `Chart`). **The platform dashboard uses the flat `StatisticCard`** (label → value → hint, colored icon top-right); the agency dashboard was recently restyled to match it.

### `landing/` — marketing page

`src/views/others/Landing/components/` — Hero · Modules · ProductShowcase · **Pricing** · **Faq** · CallToAction · Footer · TextHoverEffect. i18n `en` / `fr` / `ar` in `src/locales/lang/`.

---

## 10. Seeding, commands & tests

**Seeders** (`php artisan db:seed`) — `DatabaseSeeder` (orchestrator), `RoleSeeder` (4 roles), `AdminUserSeeder`, `PlatformAdminSeeder`, `AgencySeeder`, `CurrencySeeder`, `InvoiceTemplateSeeder`, `DemoDataSeeder`.

**Useful commands**
- `php artisan route:list` — inspect the full route table
- `php artisan mark-overdue-installments` — flip overdue installments (also scheduled in `routes/console.php`)
- `php artisan config:show pricing` — read the pricing configuration

**Tests** (`tests/`, PHPUnit)

| Unit | Feature |
|---|---|
| `Unit/ReservationStatusTest` | `ReservationEngineTest` · `ReservationSchemaTest` · `ReservationInspectionTest` · `ReservationContractTest` · `DashboardReportingTest` · `FleetManagementTest` · `FleetCatalogTest` · `ExpenseManagementTest` · `SearchAndPerformanceTest` · `PlatformCurrenciesTest` · `AgencyPaymentLockTest` · `ProfileTest` |

Use the factories in `database/factories/` — 22 factories exist, one per model.

---

## 11. Conventions — how to add a feature correctly

1. **Layering:** Controller (thin, HTTP only) → Form Request (validation) → Action / Service (business rules + transaction) → Model. Services live under `app/Services/{Module}/`; single-purpose actions under `app/Actions/{Module}/`.
2. **Any write that changes business state must:**
   - run inside a transaction,
   - take the **car lock before the reservation lock**,
   - write a `reservation_changes` row (when reservation-related),
   - write an `activity_logs` row via the `LogsActivity` trait.
3. **Never mass-assign computed columns** — keep them out of `$fillable` and set them inside the action.
4. **Never trust the client for money** — recompute totals with `PricingService`, recompute `payment_status` from the paid sum, recompute occupancy / revenue with `ReportingService`.
5. **Tenant safety:** any new tenant-owned model must `use BelongsToAgency`; no query may bypass the global scope. Cross-tenant access goes through `AgencyContext::with($id, fn () => …)` (platform side) or an explicit `withoutGlobalScope` with a written reason.
6. **Enums** for every `varchar` status column, cast in the model's `casts()`.
7. **Validation** belongs in Form Requests; whitelisted sort columns must be mirrored between the request and the query service (`IndexCarRequest` ↔ `CarQueryService`).
8. **Permissions:** add the verb to `config/permissions.php`, reference it as `permission:module.verb` on the route, then grant it in `RoleSeeder` and in the `roles.permissions` JSON.
9. **Frontend:** add the API call to `frontend/src/services/LocationService.ts`, the type to `src/@types/location.ts`, the route to `src/configs/routes.config/appsRoute.ts` plus the navigation config, then the screen under `src/views/location/`.
10. **i18n:** every new user-facing string goes into `en.json`, `fr.json` and `ar.json`.
11. Before finishing: `vendor/bin/pint --dirty` (PHP) and `npm run lint` (TS).

---

## 12. Gotchas

- **`frontend/node_modules` is tracked in git** (34,223 files) — a pre-existing repo problem. Never commit Vite cache noise.
- **No prettier config exists** in `frontend/`, so `npx prettier --check` fails on *every* file. The house style is 4-space indent, single quotes, no semicolons. Match the surrounding file; do not run `prettier --write`.
- **React 18 + `react-router` v6** (`import { Routes, Route } from 'react-router'`), not v7.
- **File uploads** go through `POST /api/v1/uploads` and return a stored path — persist the path, not the file.
- **Money is `decimal(10,2)`** — use `decimal:2` casts, `number_format($v, 2, '.', '')` for change-log values, and never compare floats.
- **`is_active = false` filters** must use `array_key_exists`, not `when()` — `false` is a legitimate filter value (`CarQueryService` documents this in code).
- **Brand / model / category filters use correlated EXISTS subqueries**, not joins, so the paginator's COUNT stays exact.
- `parent/` and `frontend/` are **separate Vite apps with separate `package.json` / `node_modules`** — never mix imports between them.

---

## 13. Quick file map

```
app/
  Actions/          Auth, Payments, Reservations  (business mutations)
  Console/Commands  MarkOverdueInstallments
  Enums/            all status/type enums
  Exceptions/       Domain exceptions (stable error codes)
  Http/Controllers/Api/V1/  (+ /Platform/ for the admin app)
  Http/Middleware/  ApplyAgencyScope, EnsureActiveAccount, EnsureAgencyCanWrite,
                    EnsurePermission, EnsurePlatformAdmin
  Http/Requests/    Form Requests (validation)
  Models/           Eloquent models (+ /Concerns/BelongsToAgency.php)
  Policies/         authorization policies
  Services/         Activity, Auth, Cars, Clients, Notifications, Payments,
                    Pricing, Reports, Reservations, Users, Expenses
  Support/Tenancy/  AgencyContext.php
config/
  permissions.php   the permission catalog (source of truth)
  pricing.php       tax, currency, duration tiers, late-grace minutes
  auth.php          token TTL
database/
  migrations/       one file per schema change
  seeders/          RoleSeeder, AgencySeeder, CurrencySeeder, ...
  factories/        22 model factories
routes/
  api.php           public + /api/v1 group + platform group
  api/*.php         one file per module
frontend/           agency CRM SPA  (port 5173)
parent/             platform admin SPA
landing/            marketing page
```
