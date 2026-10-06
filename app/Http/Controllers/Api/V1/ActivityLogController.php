<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Activity\IndexActivityLogRequest;
use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use App\Services\Activity\ActivityLogQueryService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityLogController extends Controller
{
    public function __construct(private readonly ActivityLogQueryService $logs) {}

    public function index(IndexActivityLogRequest $request): AnonymousResourceCollection
    {
        return ActivityLogResource::collection($this->logs->paginate($request->validated()));
    }

    public function show(ActivityLog $activity_log): ActivityLogResource
    {
        return new ActivityLogResource($activity_log->load('user:id,first_name,last_name'));
    }
}
