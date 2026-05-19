<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Admin : voit tout
        if ($user && $user->role === 'admin') {
            if ($request->has('all')) return response()->json(Notification::with('utilisateur')->get());
            return response()->json(Notification::with('utilisateur')->orderByDesc('created_at')->paginate($request->input('per_page', 15)));
        }

        // Producteur / Client : ne voit que ses notifications
        if ($user) {
            return response()->json(
                Notification::with('utilisateur')
                    ->where('utilisateur_id', $user->id)
                    ->orderByDesc('created_at')
                    ->get()
            );
        }

        return response()->json([], 200);
    }


    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'titre' => 'required|string|max:255',
            'message' => 'required|string',
            'lu' => 'boolean'
        ]);

        // Admin : peut créer pour n'importe qui
        if ($user && $user->role === 'admin') {
            $notification = Notification::create($request->only(['utilisateur_id', 'titre', 'message', 'lu']));
            return response()->json($notification->load('utilisateur'), 201);
        }

        // Producteur/Client : ne peut créer que pour lui-même
        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Si l'utilisateur connecté tente de créer pour un autre utilisateur : interdit
        if ((int)$request->input('utilisateur_id') !== (int)$user->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }


        $notification = Notification::create($request->only(['utilisateur_id', 'titre', 'message', 'lu']));
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

        $notification->update($request->only(['utilisateur_id', 'titre', 'message', 'lu']));
        return response()->json($notification->load('utilisateur'));
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json(null, 204);
    }
}