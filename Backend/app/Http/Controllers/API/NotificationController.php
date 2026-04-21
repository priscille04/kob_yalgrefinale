<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(Notification::with('utilisateur')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'titre' => 'required|string|max:255',
            'message' => 'required|string',
            'lu' => 'boolean'
        ]);

        $notification = Notification::create($request->all());
        return response()->json($notification->load('utilisateur'), 201);
    }

    public function show(Notification $notification)
    {
        return response()->json($notification->load('utilisateur'));
    }

    public function update(Request $request, Notification $notification)
    {
        $request->validate([
            'utilisateur_id' => 'sometimes|required|exists:utilisateurs,id',
            'titre' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'lu' => 'boolean'
        ]);

        $notification->update($request->all());
        return response()->json($notification->load('utilisateur'));
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json(null, 204);
    }
}