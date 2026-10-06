<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expenses\IndexExpenseRequest;
use App\Http\Requests\Expenses\StoreExpenseRequest;
use App\Http\Requests\Expenses\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\CarExpense;
use App\Services\Activity\LogsActivity;
use App\Services\Expenses\ExpenseQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExpenseController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly ExpenseQueryService $expenses) {}

    public function index(IndexExpenseRequest $request): AnonymousResourceCollection
    {
        return ExpenseResource::collection($this->expenses->paginate($request->validated()));
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = CarExpense::create(array_merge($request->validated(), [
            'agency_id' => $request->user()->agency_id,
            'created_by' => $request->user()->id,
        ]));

        // create() carries only the attributes passed in — refresh so the
        // response reflects the DB default (status=pending).
        $expense->refresh();

        $this->loadRelations($expense);

        $this->logActivity('expenses', 'created', $expense, $request->user(), 'Expense created', null, $this->auditValues($expense));

        return (new ExpenseResource($expense))->response()->setStatusCode(201);
    }

    public function show(CarExpense $expense): ExpenseResource
    {
        $this->loadRelations($expense);

        return new ExpenseResource($expense);
    }

    public function update(UpdateExpenseRequest $request, CarExpense $expense): ExpenseResource
    {
        $keys = array_keys($request->validated());
        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $expense->getAttribute($key)])->all();

        $expense->fill($request->validated());
        $expense->save();

        $this->loadRelations($expense);

        $this->logActivity(
            'expenses',
            'updated',
            $expense,
            $request->user(),
            'Expense updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $expense->getAttribute($key)])->all(),
        );

        return new ExpenseResource($expense);
    }

    private function loadRelations(CarExpense $expense): void
    {
        $expense->load([
            'car' => fn ($query) => $query->withTrashed(),
            'createdBy:id,first_name,last_name',
        ]);
    }

    /**
     * @param  array<int, string>|null  $keys
     * @return array<string, mixed>
     */
    private function auditValues(CarExpense $expense, ?array $keys = null): array
    {
        if ($keys !== null) {
            return collect($keys)
                ->mapWithKeys(fn (string $key) => [$key => $expense->getAttribute($key)])
                ->all();
        }

        return collect($expense->toArray())->except(['created_at', 'updated_at'])->all();
    }
}
