<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Exceptions\Domain\CurrencyInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\IndexCurrencyRequest;
use App\Http\Requests\Platform\StoreCurrencyRequest;
use App\Http\Requests\Platform\UpdateCurrencyRequest;
use App\Http\Resources\CurrencyResource;
use App\Models\Currency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Platform-side currency catalog. Currencies are shared master data, so this
 * mirrors the brand catalog: no agency scope, no agency activity logging.
 */
class CurrencyController extends Controller
{
    public function index(IndexCurrencyRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $direction = ($filters['sort_dir'] ?? null) === 'asc' ? 'asc' : 'desc';
        $sortBy = in_array($filters['sort_by'] ?? null, ['code', 'name', 'created_at'], true) ? $filters['sort_by'] : 'code';

        return CurrencyResource::collection(
            Currency::query()
                ->withCount('agencies as agencies_count')
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(function ($builder) use ($term) {
                    $like = '%'.trim($term).'%';

                    $builder->where('code', 'like', $like)
                        ->orWhere('name', 'like', $like)
                        ->orWhere('symbol', 'like', $like);
                }))
                ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
                ->orderBy($sortBy, $direction)
                ->paginate(min((int) ($filters['per_page'] ?? 15), 100)),
        );
    }

    public function store(StoreCurrencyRequest $request): JsonResponse
    {
        $currency = Currency::create($request->validated())->refresh();

        return (new CurrencyResource($currency->loadCount('agencies as agencies_count')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Currency $currency): CurrencyResource
    {
        $currency->loadCount('agencies as agencies_count');

        return new CurrencyResource($currency);
    }

    public function update(UpdateCurrencyRequest $request, Currency $currency): CurrencyResource
    {
        $currency->update($request->validated());
        $currency->refresh();

        return new CurrencyResource($currency->loadCount('agencies as agencies_count'));
    }

    public function destroy(Currency $currency): Response
    {
        if ($currency->agencies()->exists()) {
            throw new CurrencyInUseException;
        }

        $currency->delete();

        return response()->noContent();
    }
}
