<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notifications\IndexNotificationRequest;
use App\Http\Requests\Notifications\StoreNotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Services\Activity\LogsActivity;
use App\Services\Notifications\NotificationDispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly NotificationDispatcher $notifications) {}

    /**
     * Your inbox — resolved through the authenticated user's own
     * notifications relation, never by raw id, so another user's rows are
     * simply not findable. Unread first, newest first.
     */
    public function index(IndexNotificationRequest $request): AnonymousResourceCollection
    {
        return NotificationResource::collection(
            $request->user()
                ->notifications()
                // The relation's default ->latest() must be discarded, or the
                // unread-first grouping below would be a dead tiebreaker.
                ->reorder()
                ->orderByRaw('read_at is null desc')
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->paginate(min((int) $request->input('per_page', 15), 100)),
        );
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Idempotent: marking an already-read row is a no-op.
     */
    public function read(Request $request, string $notification): NotificationResource
    {
        $notification = $request->user()->notifications()->findOrFail($notification);

        if ($notification->read_at === null) {
            $notification->markAsRead();
        }

        return new NotificationResource($notification->refresh());
    }

    public function readAll(Request $request): JsonResponse
    {
        $marked = $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return response()->json([
            'marked_count' => $marked,
            'unread_count' => 0,
        ]);
    }

    public function store(StoreNotificationRequest $request): JsonResponse
    {
        $sent = $this->notifications->announcement(
            $request->user(),
            $request->string('title'),
            $request->string('body'),
            [
                'send_to_all' => $request->boolean('send_to_all'),
                'user_ids' => $request->input('user_ids'),
                'role_ids' => $request->input('role_ids'),
            ],
        );

        $this->logActivity(
            'notifications',
            'sent',
            $request->user(),
            $request->user(),
            'Announcement sent to '.$sent.' user(s)',
            null,
            ['title' => $request->string('title'), 'recipients' => $sent],
        );

        return response()->json(['sent' => $sent], 201);
    }
}
