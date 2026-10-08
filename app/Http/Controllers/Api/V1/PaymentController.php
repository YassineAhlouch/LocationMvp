<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Payments\ConfirmPaymentAction;
use App\Actions\Payments\DeletePaymentAction;
use App\Actions\Payments\RefundPaymentAction;
use App\Actions\Payments\StorePaymentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payments\ConfirmPaymentRequest;
use App\Http\Requests\Payments\IndexPaymentLedgerRequest;
use App\Http\Requests\Payments\PaymentOverviewRequest;
use App\Http\Requests\Payments\RefundPaymentRequest;
use App\Http\Requests\Payments\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Models\Reservation;
use App\Services\Notifications\NotificationDispatcher;
use App\Services\Payments\PaymentQueryService;
use App\Services\Reports\ReportingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class PaymentController extends Controller
{
    public function __construct(
        private readonly StorePaymentAction $storePayment,
        private readonly ConfirmPaymentAction $confirmPayment,
        private readonly RefundPaymentAction $refundPayment,
        private readonly DeletePaymentAction $deletePayment,
        private readonly NotificationDispatcher $notifications,
        private readonly PaymentQueryService $payments,
        private readonly ReportingService $reporting,
    ) {}

    /**
     * Agency-wide ledger: every payment record across reservations, newest
     * first, with the reservation and client pre-loaded for the table.
     */
    public function ledger(IndexPaymentLedgerRequest $request): AnonymousResourceCollection
    {
        return PaymentResource::collection($this->payments->paginate($request->validated()));
    }

    /**
     * Period totals, per-status counts and the daily cash-basis trend that
     * backs the metrics and chart on the payments page.
     */
    public function overview(PaymentOverviewRequest $request): JsonResponse
    {
        $from = $request->has('from')
            ? Carbon::parse($request->string('from'))
            : today()->startOfMonth();

        $to = $request->has('to')
            ? Carbon::parse($request->string('to'))
            : today();

        return response()->json($this->reporting->paymentOverview($from, $to));
    }

    public function index(Reservation $reservation): AnonymousResourceCollection
    {
        return PaymentResource::collection(
            $reservation->payments()
                ->with('createdBy')
                ->orderByDesc('payment_date')
                ->orderByDesc('id')
                ->get(),
        );
    }

    public function store(StorePaymentRequest $request, Reservation $reservation): JsonResponse
    {
        $payment = $this->storePayment->handle($reservation, $request->validated(), $request->user());

        // Side-effect layer (the engine must stay transport-agnostic): tell
        // everyone who can see payments that money landed — except the agent
        // who just recorded it.
        $this->notifications->paymentRecorded($payment, $request->user());

        return (new PaymentResource($payment->load('createdBy')))
            ->response()
            ->setStatusCode(201);
    }

    public function confirm(ConfirmPaymentRequest $request, Payment $payment): PaymentResource
    {
        return new PaymentResource(
            $this->confirmPayment->handle($payment, $request->user())->load('createdBy'),
        );
    }

    public function refund(RefundPaymentRequest $request, Payment $payment): PaymentResource
    {
        return new PaymentResource(
            $this->refundPayment->handle($payment, $request->validated()['reason'], $request->user())
                ->load('createdBy'),
        );
    }

    public function destroy(Request $request, Reservation $reservation, Payment $payment): Response
    {
        abort_if($payment->reservation_id !== $reservation->id, 404);

        $this->deletePayment->handle($payment, $request->user());

        return response()->noContent();
    }
}
