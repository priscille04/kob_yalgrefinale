<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


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

        // Connexion message(conversation) -> commande
        // Si la conversation est liée à un produit, on crée (si nécessaire) une commande
        // afin que le client voie la ligne dans sa liste de commandes.
        \Log::info('MessageController@store - conversation->produit_id / client_id', [
            'conversation_id' => $conversation->id,
            'conversation_client_id' => $conversation->client_id,
            'conversation_produit_id' => $conversation->produit_id,
            'expediteur_id' => $request->expediteur_id,
            'contenu_len' => mb_strlen($request->contenu ?? ''),
        ]);

        // Notif : message envoyé => notification client + notification admin + notification producteur
        try {
            $contenu = (string) ($request->contenu ?? '');
            $preview = mb_strlen($contenu) > 200 ? mb_substr($contenu, 0, 200) . '…' : $contenu;

            $client = \App\Models\Client::with('utilisateur')->find($conversation->client_id);
            $clientUtilisateurId = $client?->utilisateur?->id;

            $adminUtilisateur = \App\Models\Utilisateur::where('role', 'admin')->first();
            $adminUtilisateurId = $adminUtilisateur?->id;

            // Producteur cible via conversation->produit_id
            $producteurUtilisateurId = null;
            if (!empty($conversation->produit_id)) {
                $produit = \App\Models\Produit::with('producteur.utilisateur')->find($conversation->produit_id);
                $producteurUtilisateurId = $produit?->producteur?->utilisateur_id;

                // fallback si relation utilisateur indirecte
                if (!$producteurUtilisateurId) {
                    $producteurUtilisateurId = $produit?->producteur?->utilisateur?->id;
                }
            }

            // Notification client (si le client n'est pas l'expéditeur)
            if ($clientUtilisateurId && $clientUtilisateurId != $request->expediteur_id) {
                \App\Models\Notification::create([
                    'utilisateur_id' => $clientUtilisateurId,
                    'conversation_id' => $conversation->id,
                    'titre' => 'Nouveau message',
                    'message' => $preview,
                    'lu' => false,
                ]);
            }

            // Notification admin (si l'admin n'est pas l'expéditeur)
            if ($adminUtilisateurId && $adminUtilisateurId != $request->expediteur_id) {
                \App\Models\Notification::create([
                    'utilisateur_id' => $adminUtilisateurId,
                    'conversation_id' => $conversation->id,
                    'titre' => 'Nouveau message (client)',
                    'message' => $preview,
                    'lu' => false,
                ]);
            }

            // Notification producteur (si trouvé et si le producteur n'est pas l'expéditeur)
            if ($producteurUtilisateurId && $producteurUtilisateurId != $request->expediteur_id) {
                \App\Models\Notification::create([
                    'utilisateur_id' => $producteurUtilisateurId,
                    'conversation_id' => $conversation->id,
                    'titre' => 'Nouveau message (client)',
                    'message' => $preview,
                    'lu' => false,
                ]);
            }

        } catch (\Throwable $e) {
            \Log::error('MessageController@store - notification creation failed', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversation->id,
                'expediteur_id' => $request->expediteur_id,
            ]);
        }


        if (!empty($conversation->produit_id)) {

            $commandeExistante = \App\Models\Commande::where('client_id', $conversation->client_id)
                ->where('produit_id', $conversation->produit_id)
                ->whereIn('statut', ['en_attente', 'confirmee', 'en_cours'])
                ->first();

            \Log::info('MessageController@store - commandeExistante ?', [
                'exists' => (bool) $commandeExistante,
                'client_id' => $conversation->client_id,
                'produit_id' => $conversation->produit_id,
            ]);

            if (!$commandeExistante) {
                $produit = \App\Models\Produit::find($conversation->produit_id);

                if ($produit) {
                    $created = \App\Models\Commande::create([
                        'client_id' => $conversation->client_id,
                        'produit_id' => $conversation->produit_id,
                        'quantite' => 1,
                        'total' => $produit->prix * 1,
                        'statut' => 'en_attente',
                    ]);

                    \Log::info('MessageController@store - commande créée', [
                        'commande_id' => $created->id,
                    ]);
                } else {
                    \Log::warning('MessageController@store - produit introuvable', [
                        'produit_id' => $conversation->produit_id,
                    ]);
                }
            }
        } else {
            \Log::warning('MessageController@store - conversation sans produit_id', [
                'conversation_id' => $conversation->id,
                'client_id' => $conversation->client_id,
            ]);
        }

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
