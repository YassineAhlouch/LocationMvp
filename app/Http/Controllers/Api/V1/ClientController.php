<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clients\IndexClientRequest;
use App\Http\Requests\Clients\StoreClientRequest;
use App\Http\Requests\Clients\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\Activity\LogsActivity;
use App\Services\Clients\ClientQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ClientController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly ClientQueryService $clients) {}

    public function index(IndexClientRequest $request): AnonymousResourceCollection
    {
        return ClientResource::collection($this->clients->paginate($request->validated()));
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $client = Client::create(array_merge($request->validated(), [
            'agency_id' => $request->user()->agency_id,
        ]));

        // create() carries only the attributes passed in — refresh so the
        // response reflects DB defaults (status=normal, is_active=true).
        $client->refresh();

        $this->logActivity(
            'clients',
            'created',
            $client,
            $request->user(),
            'Client created',
            null,
            $this->auditValues($client),
        );

        return (new ClientResource($client))->response()->setStatusCode(201);
    }

    public function show(Client $client): ClientResource
    {
        return new ClientResource($client->loadCount('reservations as bookings_count'));
    }

    public function update(UpdateClientRequest $request, Client $client): ClientResource
    {
        $keys = array_keys($request->validated());
        $old = $this->auditValues($client, $keys);

        $client->fill($request->validated());
        $client->save();

        $this->logActivity(
            'clients',
            'updated',
            $client,
            $request->user(),
            'Client updated',
            $old,
            $this->auditValues($client, $keys),
        );

        return new ClientResource($client);
    }

    public function destroy(Request $request, Client $client): Response
    {
        $old = $this->auditValues($client);

        $client->delete();

        $this->logActivity(
            'clients',
            'deleted',
            $client,
            $request->user(),
            'Client deleted',
            $old,
        );

        return response()->noContent();
    }

    /**
     * Cast-aware attribute snapshot for the audit trail.
     *
     * @param  array<int, string>|null  $keys
     * @return array<string, mixed>
     */
    private function auditValues(Client $client, ?array $keys = null): array
    {
        if ($keys !== null) {
            return collect($keys)
                ->mapWithKeys(fn (string $key) => [$key => $client->getAttribute($key)])
                ->all();
        }

        return collect($client->toArray())->except(['created_at', 'updated_at', 'deleted_at'])->all();
    }
}
