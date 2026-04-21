<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('utilisateur_id');

        $query = Conversation::with([
            'client.utilisateur',
            'producteur.utilisateur',
            'produit',
            'dernierMessage.expediteur',
        ]);

        if ($userId) {
            $query->where(function ($q) use ($userId) {
                $q->whereHas('client', fn($c) => $c->where('utilisateur_id', $userId))
                    ->orWhereHas('producteur', fn($p) => $p->where('utilisateur_id', $userId));
            });
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'producteur_id' => 'required|exists:producteurs,id',
            'produit_id' => 'nullable|exists:produits,id',
        ]);

        $conversation = Conversation::firstOrCreate(
            $request->only('client_id', 'producteur_id', 'produit_id')
        );

        return response()->json(
            $conversation->load('client.utilisateur', 'producteur.utilisateur', 'produit'),
            201
        );
    }

    public function show(Conversation $conversation)
    {
        return response()->json(
            $conversation->load([
                'client.utilisateur',
                'producteur.utilisateur',
                'produit',
                'messages.expediteur',
            ])
        );
    }

    public function destroy(Conversation $conversation)
    {
        $conversation->delete();
        return response()->json(null, 204);
    }
}
