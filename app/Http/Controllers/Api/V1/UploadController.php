<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Uploads\StoreUploadRequest;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    /**
     * Persist an image file on the public disk and hand back the relative
     * URL callers store on their gallery rows (car_images.image). Relative
     * so the same path resolves both through the Vite dev proxy and on the
     * deployed host.
     */
    public function store(StoreUploadRequest $request): JsonResponse
    {
        $path = $request->file('file')->store('uploads', 'public');

        return response()->json(['url' => '/storage/'.$path], 201);
    }
}
