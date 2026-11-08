import type { DocsContent } from './types'

const en: DocsContent = {
    groups: {
        gettingStarted: 'Getting Started',
        areas: 'System Areas',
        statuses: 'Statuses',
        flow: 'Flow',
    },
    labels: {
        howTo: 'How to use it',
        goodToKnow: 'Good to know',
    },
    sections: {
        introduction: {
            kind: 'introduction',
            title: 'Introduction',
            paras: [
                'Eyris is the operating system of the car rental agency. The fleet, the bookings, the money, the staff and the public lead flow all live in one place, so the agency runs its daily business without spreadsheets.',
                'Everything revolves around one object: the reservation. A car keeps its dates held while a reservation is pending, confirmed, reserved or active — double booking is not possible. Payments attach to the reservation, costs attach to the car, and every change lands in the audit log. The dashboard, KPIs and reports read from that same source of truth.',
            ],
            listHeading: 'What runs inside',
            listItems: [
                'Fleet — vehicles, statuses, expenses, statistics',
                'Reservations — the rental life cycle, calendar and printable invoices',
                'Clients — directory, sources and segments',
                'Money — payments and expenses',
                'Public landing — QR posters and the lead inbox',
                'Team — users, roles and permissions',
                'Insights — dashboard KPIs, reports, activity log',
            ],
            outro: 'New here? Start with “First steps” in the sidebar — it walks the whole setup in order.',
        },
        'first-steps': {
            kind: 'steps',
            title: 'First steps',
            intro: 'Follow this order once and the whole system lines up behind you.',
            steps: [
                {
                    title: 'Sign in',
                    body: 'Open /sign-in and use your email and password. Your role and permissions decide which screens you see.',
                },
                {
                    title: 'Set the currency (admin)',
                    body: 'Settings → Currency. The choice is agency-wide: every price, invoice and KPI afterwards uses it.',
                },
                {
                    title: 'Create your team',
                    body: 'Users → Add user: name, email and role. The role controls what the member can view or change.',
                },
                {
                    title: 'Register your fleet',
                    body: 'Vehicles → Add vehicle: brand, model, year, plate, fuel type, transmission, seats and daily pricing.',
                },
                {
                    title: 'Register your clients',
                    body: 'Clients → Add client: contact details, acquisition source and segment (normal, VIP, blacklist).',
                },
                {
                    title: 'Create your first reservation',
                    body: 'Reservations → New reservation: pick the client, the car and the dates. Overlapping requests on a blocked car are refused automatically.',
                },
                {
                    title: 'Collect the payment',
                    body: 'Finances → Payments: take full or partial payments on the reservation; the agreement moves from unpaid to partial to paid.',
                },
                {
                    title: 'Track costs and work',
                    body: 'Log fuel, repairs and other costs in Finances → Expenses, and assign follow-up items in Tasks.',
                },
                {
                    title: 'Go public',
                    body: 'QR codes → Create a poster, print it and put it at the agency. Each scan opens the public landing page and sends the request to your QR inbox.',
                },
            ],
        },
        dashboard: {
            kind: 'area',
            title: 'Dashboard & KPIs',
            intro:
                'The home screen. Big tiles for revenue, fleet state, occupancy and more give the agency its pulse at a glance. Every tile drills into its own detail page with charts and the underlying records.',
            steps: [
                {
                    title: 'Open it every morning',
                    body: 'The tiles answer the daily questions at a glance: how much money came in, how many cars are out, what is pending.',
                },
                {
                    title: 'Click a tile to drill down',
                    body: 'Each KPI opens a detail page with the chart over time and the exact records behind the number, so you never stop at a dead end.',
                },
                {
                    title: 'Read it, do not fill it',
                    body: 'The dashboard has no data entry. It reads from reservations, payments and cars — keep those correct and the tiles stay correct.',
                },
            ],
            notes: [
                'Numbers are computed live — no manual refresh or re-entry anywhere.',
            ],
        },
        tasks: {
            kind: 'area',
            title: 'Tasks',
            intro:
                'The team checklist. Work from the simple list or move tickets across the Kanban board as work progresses.',
            steps: [
                {
                    title: 'Create the task',
                    body: 'Say what has to be done, who does it and when it is due — one line per item of the daily work.',
                },
                {
                    title: 'Track it in the list or the board',
                    body: 'The list keeps everything in one scroll; the Kanban board lets you drag tickets across columns as they start, progress and finish.',
                },
                {
                    title: 'Close what is done',
                    body: 'Finishing a task keeps the board honest for the next shift.',
                },
            ],
        },
        reservations: {
            kind: 'area',
            title: 'Reservations',
            intro:
                'The heart of the system. Everything a rental goes through, from the first phone call to the returned car.',
            steps: [
                {
                    title: 'Pick the dates first',
                    body: 'In New reservation, start on the Trip section: enter the pickup date and time and the expected return. Working dates first lets the car picker show the real availability for that exact window.',
                },
                {
                    title: 'Choose the car',
                    body: 'In Car & clients, open the car picker — every car shows Available or Unavailable for your dates. If the window even touches a booked period, that car is refused: double booking cannot happen.',
                },
                {
                    title: 'Pick the client',
                    body: 'The primary client is required — type in the box to search by name or phone, or create the client right there in the form (names, CIN or passport, driving license and expiry, phones). Add a secondary driver if needed.',
                },
                {
                    title: 'Set the starting status',
                    body: 'Pending for a note taken over the phone, Confirmed when the deal is done, Reserved for a phone hold that is not sure yet. Each choice comes with a hint when to use it.',
                },
                {
                    title: 'Check the pricing',
                    body: 'The daily rate pre-fills from the car. Adjust it, add a discount and a deposit, and build extra lines — each extra has a name, a fixed or per-day price type, a quantity and a unit price. The quote recalculates as you type.',
                },
                {
                    title: 'Record the payments',
                    body: 'In the Payment section, add one or several payment lines: date, amount, method (cash, card or transfer), reference and status. The agreement summary shows the generated payment status — unpaid, partial or paid.',
                },
                {
                    title: 'Save and let it hold',
                    body: 'Save the reservation and its dates are held immediately. Nobody else can book that car for the same window.',
                },
                {
                    title: 'Drive the life from the list',
                    body: 'From the reservation list, run the lifecycle: activate it once the contract is signed, complete it when the car returns, or cancel / mark no-show — the form asks for a reason so the history stays clean.',
                },
                {
                    title: 'Edit or extend',
                    body: 'Edit a reservation to correct details. Extending the rental keeps the status and only moves the dates. Print the invoice from the reservation — it follows the invoice template from Settings.',
                },
            ],
            notes: [
                'Every move is validated — statuses refuse illegal jumps, and conflicts are surfaced with the reservation numbers involved.',
                'The month calendar per car is the fastest way to spot free slots.',
                'See Reservation statuses in the sidebar for the full state machine.',
            ],
        },
        vehicles: {
            kind: 'area',
            title: 'Vehicles & fleet',
            intro:
                'Register and maintain the fleet. Every car page gathers its data in one place.',
            steps: [
                {
                    title: 'Add the identity',
                    body: 'In Add vehicle: brand, model and category (each from a picker), registration number, optional VIN, year and color.',
                },
                {
                    title: 'Fill the specs',
                    body: 'Transmission, fuel type, seats and doors — these feed what customers see on the public landing.',
                },
                {
                    title: 'Price the car',
                    body: 'Daily price, plus purchase price if you track financing. The daily price is what a new reservation pre-fills.',
                },
                {
                    title: 'Log the state',
                    body: 'Initial and current mileage, and the fuel level in percent — handy at handover.',
                },
                {
                    title: 'Protect the dates that matter',
                    body: 'Insurance company and expiry, plus technical inspection expiry — when these approach, the car needs attention before the paperwork does.',
                },
                {
                    title: 'Upload photos and notes',
                    body: 'Drop images and set the primary one used on the landing and printouts. Notes keep any additional detail.',
                },
                {
                    title: 'Manage its life',
                    body: 'Cars start as available. Switch to maintenance or inactive to pull one out of rotation; rented and reserved move on their own as reservations progress.',
                },
            ],
            notes: [
                'The car page collects Overview, Reservations, Expenses and History tabs — cost and booking history per car in one place.',
                'See Car statuses in the sidebar for what each status allows.',
            ],
        },
        'qr-landing': {
            kind: 'area',
            title: 'QR codes & landing',
            intro:
                'Printable posters that open the public booking landing page. Customers scan, browse available cars in their own language (EN / FR / AR / ES) and send a request — no account needed.',
            steps: [
                {
                    title: 'Create the poster',
                    body: 'In QR codes, create a poster and print it. Put it on the agency counter, the sidewalk or your socials.',
                },
                {
                    title: 'Customer scans and browses',
                    body: 'The scan opens the public landing in the visitor language. They enter their dates and see which cars are actually free.',
                },
                {
                    title: 'They send the request',
                    body: 'One form later, the request is on its way — no login, no app.',
                },
                {
                    title: 'Work the inbox',
                    body: 'The request lands in Reservations → QR inbox with the customer, phone and email, the requested car, the pickup → return window and their message.',
                },
                {
                    title: 'Act on it',
                    body: 'Open the details and use the Call or WhatsApp buttons. Mark it contacted after talking, then convert it into a real reservation — or reject it.',
                },
            ],
            notes: [
                'Treat the inbox as a leads pipeline: new → contacted → converted or rejected. Converting builds the reservation for you.',
            ],
        },
        clients: {
            kind: 'area',
            title: 'Clients',
            intro:
                'The customer directory. Every reservation is tied to a client, and the source tells you which channel brought them.',
            steps: [
                {
                    title: 'Capture the person',
                    body: 'In Add client: first and last name, primary and secondary phone, and email.',
                },
                {
                    title: 'Capture the papers',
                    body: 'CIN, passport number, driving license number and its expiry — the fields the counter checks before handing the keys.',
                },
                {
                    title: 'Capture the profile',
                    body: 'Birth date and place, nationality, city and country.',
                },
                {
                    title: 'Tag source and segment',
                    body: 'Source records how they arrived (Facebook, WhatsApp, referral, phone, walk-in or other) and status marks them normal, VIP or blacklist.',
                },
                {
                    title: 'Reuse everywhere',
                    body: 'At reservation time, type in the client picker to find them by name or phone — no re-entering.',
                },
            ],
            notes: [
                'Blacklist clients should not get a car; VIP clients deserve the better rate and service.',
                'See Client & lead statuses in the sidebar.',
            ],
        },
        payments: {
            kind: 'area',
            title: 'Payments',
            intro:
                'The money side of each reservation: totals, payment records and installments.',
            steps: [
                {
                    title: 'Open the reservation money',
                    body: 'From Finances → Payments, find the reservation — its total, what came in and the current agreement status in one view.',
                },
                {
                    title: 'Record a payment',
                    body: 'Enter the payment date, the amount, the method (cash, card or transfer) and an optional reference. Mark it paid when the money is really in the drawer.',
                },
                {
                    title: 'Watch the agreement move',
                    body: 'As records settle, the agreement goes unpaid → partial → paid. The badge is visible on the payments page and on the reservation itself.',
                },
                {
                    title: 'Handle the exceptions',
                    body: 'A payment that goes back to the customer becomes a refund record. For split plans, installments each carry a due date — late ones flip to overdue.',
                },
            ],
            notes: [
                'Payments feed the collections report and the revenue KPIs automatically.',
                'See Payment statuses in the sidebar for the details.',
            ],
        },
        expenses: {
            kind: 'area',
            title: 'Expenses',
            intro:
                'The cost side of the fleet: fuel, maintenance, fines, repairs, service — per car and per period.',
            steps: [
                {
                    title: 'Record the cost',
                    body: 'Add expense: pick the car, the type, and give it a title and description.',
                },
                {
                    title: 'Enter the money details',
                    body: 'The amount and the vendor — who was paid or has to be paid.',
                },
                {
                    title: 'Set the dates',
                    body: 'Start date, due date, and the date it was actually paid.',
                },
                {
                    title: 'Settle or escalate',
                    body: 'Pending costs get marked paid when settled; ones that pass their due date flag as overdue so nothing is forgotten.',
                },
            ],
            notes: [
                'Car costs also show up on the car page Expenses tab, next to its reservations.',
            ],
        },
        'users-roles': {
            kind: 'area',
            title: 'Users & roles',
            intro:
                'Staff accounts and what each one may do. Roles bundle verb permissions (create, read, update, delete…) and every screen checks them.',
            steps: [
                {
                    title: 'Add the staff member',
                    body: 'Name and email in Users → Add user, then attach a role.',
                },
                {
                    title: 'Choose or build the role',
                    body: 'A role is a bundle of verbs per module — a reservations-only reader differs from a finance editor. Build the role in the roles dialog if none fits yet.',
                },
                {
                    title: 'Hand over the credentials',
                    body: 'The member signs in with their own email and password; the interface then hides everything their role forbids — menus, buttons and actions.',
                },
                {
                    title: 'Rest on the audit log',
                    body: 'Every action a member takes is recorded. If something changes, the log tells you who and when.',
                },
            ],
            notes: [
                'Sensitive areas like financing run through a dedicated permission, granted separately.',
            ],
        },
        settings: {
            kind: 'area',
            title: 'Settings',
            intro: 'Agency-wide options, reserved for administrators.',
            steps: [
                {
                    title: 'Pick the currency',
                    body: 'In Currency, choose the agency currency from the platform-curated list — the platform keeps the catalog, the agency only chooses. Every price, invoice and KPI afterwards uses it.',
                },
                {
                    title: 'Style the invoices',
                    body: 'In Invoice template: the logo, the title and the footer text that every printed reservation invoice carries.',
                },
            ],
            notes: [
                'Both choices are agency-wide — they apply to the whole team, not per user.',
            ],
        },
        reports: {
            kind: 'area',
            title: 'Reports',
            intro:
                'Performance over any date range, built on the same records as the dashboard and ready for exports.',
            steps: [
                {
                    title: 'Choose the angle',
                    body: 'Client performance, vehicle performance or collections — the report that answers the question you are asking this month.',
                },
                {
                    title: 'Set the range',
                    body: 'Pick the period — last month, this quarter or a custom range — and the metrics and charts follow.',
                },
                {
                    title: 'Read and export',
                    body: 'Scan the metrics, drill into the tables behind them and export the view when the owner asks for a sheet.',
                },
            ],
            notes: [
                'Reports never invent numbers — they aggregate the same reservations, payments and cars the rest of the system uses.',
            ],
        },
        activity: {
            kind: 'area',
            title: 'Activity',
            intro:
                'Traceability: an audit log of staff actions plus the in-app notification center, so nothing happens in the dark.',
            steps: [
                {
                    title: 'Look before you investigate',
                    body: 'The audit log answers who did what, when — on reservations, cars, payments and role changes.',
                },
                {
                    title: 'Let the notifications carry the news',
                    body: 'The notification center gathers the in-app alerts for the team — check it, no one has to shout across the office.',
                },
            ],
            notes: [
                'Everything here is automatic. There is nothing to fill — only to read.',
            ],
        },
        'status-reservations': {
            kind: 'statuses',
            title: 'Reservation statuses',
            intro:
                'The life cycle of a rental. These moves are the only legal ones — the system refuses anything else.',
            entities: [
                {
                    heading: 'Reservation',
                    note: 'Pending, confirmed, reserved and active hold the car dates — they block new bookings. Extending keeps the status and only moves the dates.',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'reservations.status.pending',
                            tone: 'amber',
                            meaning:
                                'Just created, waiting for confirmation. Holds the car dates.',
                            moves: ['confirmed', 'reserved', 'cancelled', 'no_show'],
                        },
                        {
                            value: 'confirmed',
                            labelKey: 'reservations.status.confirmed',
                            tone: 'indigo',
                            meaning: 'Client confirmed. Holds the car dates.',
                            moves: ['active (contract signed)', 'cancelled', 'no_show'],
                        },
                        {
                            value: 'reserved',
                            labelKey: 'reservations.status.reserved',
                            tone: 'violet',
                            meaning:
                                'Phone hold — not confirmed yet. Holds the car dates.',
                            moves: ['confirmed', 'active', 'cancelled', 'no_show'],
                        },
                        {
                            value: 'active',
                            labelKey: 'reservations.status.active',
                            tone: 'sky',
                            meaning: 'Rental in progress. Holds the car dates.',
                            moves: ['completed'],
                        },
                        {
                            value: 'completed',
                            labelKey: 'reservations.status.completed',
                            tone: 'emerald',
                            meaning: 'Car returned and rental closed — final state.',
                        },
                        {
                            value: 'cancelled',
                            labelKey: 'reservations.status.cancelled',
                            tone: 'rose',
                            meaning: 'Abandoned — final state, frees the dates.',
                        },
                        {
                            value: 'no_show',
                            labelKey: 'reservations.status.no_show',
                            tone: 'rose',
                            meaning: 'Client never came — final state, frees the dates.',
                        },
                    ],
                },
            ],
        },
        'status-cars': {
            kind: 'statuses',
            title: 'Car statuses',
            intro:
                'Where each vehicle stands in its life. The fleet list and the car page manage them.',
            entities: [
                {
                    heading: 'Car',
                    rows: [
                        {
                            value: 'available',
                            labelKey: 'cars.status.available',
                            tone: 'emerald',
                            meaning:
                                'Ready to rent — the only status that can enter a new reservation.',
                        },
                        {
                            value: 'reserved',
                            labelKey: 'cars.status.reserved',
                            tone: 'violet',
                            meaning:
                                'Dates are held by an upcoming booking (confirmed or phone hold).',
                        },
                        {
                            value: 'rented',
                            labelKey: 'cars.status.rented',
                            tone: 'sky',
                            meaning: 'Currently on rent with an active reservation.',
                        },
                        {
                            value: 'maintenance',
                            labelKey: 'cars.status.maintenance',
                            tone: 'amber',
                            meaning: 'Under service or repair — not rentable.',
                        },
                        {
                            value: 'inactive',
                            labelKey: 'cars.status.inactive',
                            tone: 'gray',
                            meaning: 'Archived or out of service — not rentable.',
                        },
                    ],
                },
            ],
            footnote:
                'Only available cars can enter a new reservation. Switching a car to maintenance or inactive takes it out of rotation.',
        },
        'status-money': {
            kind: 'statuses',
            title: 'Payment statuses',
            intro:
                'How money moves, from the agreement to each record and installment, plus the expense side.',
            entities: [
                {
                    heading: 'Payment agreement (per reservation)',
                    rows: [
                        {
                            value: 'unpaid',
                            labelKey: 'reservations.payment.unpaid',
                            tone: 'rose',
                            meaning: 'Nothing collected yet on the reservation.',
                        },
                        {
                            value: 'partial',
                            labelKey: 'reservations.payment.partial',
                            tone: 'amber',
                            meaning: 'Some money collected, balance remaining.',
                        },
                        {
                            value: 'paid',
                            labelKey: 'reservations.payment.paid',
                            tone: 'emerald',
                            meaning: 'Fully collected.',
                        },
                    ],
                },
                {
                    heading: 'Payment record',
                    note: 'A record that turns to refunded is final — the money went back to the client.',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'payments.status.pending',
                            tone: 'amber',
                            meaning: 'Recorded but not settled yet.',
                            moves: ['paid'],
                        },
                        {
                            value: 'paid',
                            labelKey: 'payments.status.paid',
                            tone: 'emerald',
                            meaning: 'Money received.',
                            moves: ['refunded'],
                        },
                        {
                            value: 'refunded',
                            labelKey: 'payments.status.refunded',
                            tone: 'violet',
                            meaning: 'Given back to the client — final state.',
                        },
                    ],
                },
                {
                    heading: 'Installment',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'payments.status.pending',
                            tone: 'amber',
                            meaning: 'Installment scheduled, not yet due or not yet paid.',
                            moves: ['paid'],
                        },
                        {
                            value: 'paid',
                            labelKey: 'payments.status.paid',
                            tone: 'emerald',
                            meaning: 'Installment collected.',
                        },
                        {
                            value: 'overdue',
                            labelKey: 'expenses.status.overdue',
                            tone: 'rose',
                            meaning: 'Due date passed without payment — needs follow-up.',
                        },
                    ],
                },
                {
                    heading: 'Expense',
                    rows: [
                        {
                            value: 'pending',
                            labelKey: 'expenses.status.pending',
                            tone: 'amber',
                            meaning: 'Cost recorded, waiting to be settled.',
                            moves: ['paid'],
                        },
                        {
                            value: 'paid',
                            labelKey: 'expenses.status.paid',
                            tone: 'emerald',
                            meaning: 'Cost settled.',
                        },
                        {
                            value: 'overdue',
                            labelKey: 'expenses.status.overdue',
                            tone: 'rose',
                            meaning: 'Settlement late — flagged for follow-up.',
                        },
                    ],
                },
            ],
        },
        'status-people': {
            kind: 'statuses',
            title: 'Client & lead statuses',
            intro:
                'How the agency treats customers and how public leads progress.',
            entities: [
                {
                    heading: 'Client',
                    rows: [
                        {
                            value: 'normal',
                            labelKey: 'clients.statusOption.normal',
                            tone: 'sky',
                            meaning: 'Regular customer, no special treatment.',
                        },
                        {
                            value: 'vip',
                            labelKey: 'clients.statusOption.vip',
                            tone: 'violet',
                            meaning:
                                'High-value customer — prioritize pricing and service.',
                        },
                        {
                            value: 'blacklist',
                            labelKey: 'clients.statusOption.blacklist',
                            tone: 'rose',
                            meaning: 'Blocked customer — do not rent to them.',
                        },
                    ],
                },
                {
                    heading: 'Landing request',
                    note: 'Converting a lead creates a real reservation for the client and car.',
                    rows: [
                        {
                            value: 'new',
                            labelKey: 'landingReservations.status.new',
                            tone: 'sky',
                            meaning: 'Request just received from the public landing page.',
                            moves: ['contacted', 'converted', 'rejected'],
                        },
                        {
                            value: 'contacted',
                            labelKey: 'landingReservations.status.contacted',
                            tone: 'amber',
                            meaning: 'Your team called or messaged the lead.',
                            moves: ['converted', 'rejected'],
                        },
                        {
                            value: 'converted',
                            labelKey: 'landingReservations.status.converted',
                            tone: 'emerald',
                            meaning: 'Lead turned into a real reservation.',
                        },
                        {
                            value: 'rejected',
                            labelKey: 'landingReservations.status.rejected',
                            tone: 'rose',
                            meaning: 'Lead refused — final state.',
                        },
                    ],
                },
            ],
        },
        lifecycle: {
            kind: 'lifecycle',
            title: 'Lifecycle',
            flow: [
                'QR poster',
                'Landing request (new)',
                'Contacted',
                'Converted',
                'Reservation (pending)',
                'Confirmed',
                'Active + payments',
                'Completed',
                'Car available again',
            ],
            paras: [
                'A customer scans the QR poster and fills the public landing page in their own language. The request drops into the QR inbox as new; the team marks it contacted after the first call, and converts it when the deal is made.',
                'Converting creates a real reservation that holds the car dates while it is pending, confirmed, reserved or active. Payments collect on the reservation while Expenses track the cost side and Tasks carry the operational follow-up.',
                'When the car comes back, the reservation is completed, the car becomes available again, and every figure lands in the Dashboard, Reports and the audit log automatically — nothing to re-enter.',
            ],
        },
    },
}

export default en
