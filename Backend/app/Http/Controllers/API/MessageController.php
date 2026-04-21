<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation)
    {
        $messages = $conversation->messages()->with('expediteur')->get();

        return response()->json($messages);
    }

    public function store(Request $request, Conversation $conversation)
    {
        $request->validate([
            'expediteur_id' => 'required|exists:utilisateurs,id',
            'contenu' => 'required|string|max:5000',
        ]);

        $message = $conversation->messages()->create([
            'expediteur_id' => $request->expediteur_id,
            'contenu' => $request->contenu,
        ]);

        return response()->json($message->load('expediteur'), 201);
    }

    public function markAsRead(Conversation $conversation, Request $request)
    {
        $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,id',
        ]);

        $conversation->messages()
            ->where('expediteur_id', '!=', $request->utilisateur_id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['message' => 'Messages marqués comme lus']);
    }
}
