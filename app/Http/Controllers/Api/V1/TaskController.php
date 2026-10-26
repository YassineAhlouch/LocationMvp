<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\TaskGroup;
use App\Models\User;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use LogsActivity;

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $tasks = Task::with('users')
            ->where('agency_id', $user->agency_id)
            ->visibleTo($user)
            ->orderBy('updated_at', 'desc')
            ->get();

        $groups = TaskGroup::where('agency_id', $user->agency_id)
            ->orderBy('position')
            ->get();

        $allMembers = User::where('agency_id', $user->agency_id)
            ->active()
            ->get()
            ->map(function ($u) {
                return [
                    'id' => (string) $u->id,
                    'name' => $u->full_name,
                    'email' => $u->email,
                    'img' => $u->avatar ?? '',
                    'permissionRole' => 'member',
                    'status' => 'active',
                ];
            })
            ->values();

        return response()->json([
            'tasks' => TaskResource::collection($tasks)->resolve(),
            'groups' => $groups->map(fn ($g) => [
                'id' => (string) $g->id,
                'name' => $g->name,
                'color' => $g->color,
            ])->values(),
            'projectMeta' => [
                'id' => '1',
                'title' => 'Tasks',
                'description' => 'Shared tasks',
                'participantMembers' => $allMembers,
                'allMembers' => $allMembers,
            ],
        ]);
    }

    public function groups(Request $request): JsonResponse
    {
        $groups = TaskGroup::where('agency_id', $request->user()->agency_id)
            ->orderBy('position')
            ->get()
            ->map(fn ($g) => [
                'id' => (string) $g->id,
                'name' => $g->name,
                'color' => $g->color,
            ]);

        return response()->json(['groups' => $groups]);
    }

    public function storeGroup(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $position = (int) TaskGroup::where('agency_id', $user->agency_id)->max('position') + 1;

        $group = TaskGroup::create([
            'agency_id' => $user->agency_id,
            'name' => $data['name'],
            'color' => $data['color'] ?? 'blue',
            'position' => $position,
        ]);

        $this->logActivity('tasks', 'created', $group, $user, 'Task column created', null, [
            'name' => $group->name,
        ]);

        return response()->json([
            'id' => (string) $group->id,
            'name' => $group->name,
            'color' => $group->color,
        ], 201);
    }

    public function updateGroup(Request $request, TaskGroup $group): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'color' => ['sometimes', 'string', 'max:50'],
        ]);

        $group->fill($data);
        $group->save();

        return response()->json([
            'id' => (string) $group->id,
            'name' => $group->name,
            'color' => $group->color,
        ]);
    }

    /**
     * Deleting a column re-homes its tasks into the first remaining column
     * so no task is orphaned with a dangling column_id.
     */
    public function destroyGroup(Request $request, TaskGroup $group): JsonResponse
    {
        $user = $request->user();

        $fallback = TaskGroup::where('agency_id', $user->agency_id)
            ->where('id', '!=', $group->id)
            ->orderBy('position')
            ->first();

        if ($fallback) {
            Task::where('column_id', (string) $group->id)
                ->update(['column_id' => (string) $fallback->id]);
        }

        $group->delete();

        return response()->json(['deleted' => true]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'column_id' => ['nullable', 'string'],
            'priority' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'due_date' => ['nullable', 'date'],
            'cover' => ['nullable', 'string'],
            'visibility' => ['nullable', 'in:shared,private'],
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id'],
        ]);

        $task = Task::create([
            'agency_id' => $user->agency_id,
            'created_by' => $user->id,
            'subject' => $data['subject'],
            'description' => $data['description'] ?? null,
            'column_id' => $data['column_id'] ?? 'todo',
            'priority' => $data['priority'] ?? 'Medium',
            'tags' => $data['tags'] ?? [],
            'due_date' => $data['due_date'] ?? null,
            'cover' => $data['cover'] ?? null,
            'visibility' => $data['visibility'] ?? 'shared',
        ]);

        if (! empty($data['user_ids'])) {
            $task->users()->sync($data['user_ids']);
        }

        $this->logActivity('tasks', 'created', $task, $user, 'Task created', null, [
            'subject' => $task->subject,
        ]);

        return (new TaskResource($task->load('users')))->response()->setStatusCode(201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();
        $canView = $task->visibility === 'shared'
            || $task->created_by === $user->id
            || $task->users()->where('users.id', $user->id)->exists();

        abort_unless($canView, 403);

        $payload = new TaskResource($task->load('users'));

        // Comments / subtasks / attachments are not persisted yet; the
        // detail dialog renders them, so always send well-formed arrays.
        return response()->json([
            ...$payload->resolve(),
            'comments' => [],
            'subtasks' => [],
            'attachments' => [],
        ]);
    }

    public function update(Request $request, Task $task): TaskResource
    {
        $user = $request->user();
        $canEdit = $task->created_by === $user->id || $task->users()->where('users.id', $user->id)->exists() || $task->visibility === 'shared';

        abort_unless($canEdit, 403);

        $data = $request->validate([
            'subject' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'column_id' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'string'],
            'tags' => ['nullable', 'array'],
            'due_date' => ['nullable', 'date'],
            'cover' => ['nullable', 'string'],
            'visibility' => ['nullable', 'in:shared,private'],
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id'],
        ]);

        $old = $task->getAttributes();

        $task->fill($data);
        $task->save();

        if (array_key_exists('user_ids', $data)) {
            $task->users()->sync($data['user_ids'] ?? []);
        }

        $this->logActivity('tasks', 'updated', $task, $user, 'Task updated', $old, $task->getAttributes());

        return new TaskResource($task->load('users'));
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();
        abort_unless($task->created_by === $user->id, 403);

        $task->delete();

        $this->logActivity('tasks', 'deleted', $task, $user, 'Task deleted');

        return response()->json(['deleted' => true]);
    }
}
