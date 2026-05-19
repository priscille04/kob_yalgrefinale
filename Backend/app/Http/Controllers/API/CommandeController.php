<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    private function producteurIdFromUser($user)
    {
        // Le modèle Utilisateur ne contient pas de champ producteur_id directement,
        // donc on récupère via la relation.
        return $user?->producteur?->id;
    }

    private function scopeProducteurAccess($query)
    {
        $user = request()->user();
        $producteurId = $this->producteurIdFromUser($user);

        // Un producteur ne doit voir que les commandes liées à ses produits
        if ($producteurId) {
            $query->whereHas('produit.producteur', function ($q) use ($producteurId) {
                $q->where('id', $producteurId);
            });
        }

        return $query;
    }

    public function index(Request $request)
    {
        $query = Commande::with('client.utilisateur', 'produit.producteur.utilisateur');

        $this->scopeProducteurAccess($query);

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('produit_id')) {
            $query->where('produit_id', $request->produit_id);
        }

        // Filtre par producteur (via le produit) — admin uniquement (sinon on reste sur le producteur connecté)
        if ($request->filled('producteur_id') && !(request()->user() && request()->user()->producteur_id)) {
            $query->whereHas('produit.producteur', function ($q) use ($request) {
                $q->where('id', $request->producteur_id);
            });
        }

        if ($request->has('all')) return response()->json($query->latest()->get());
        return response()->json($query->latest()->paginate($request->input('per_page', 15)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1',
        ]);

        $produit = Produit::findOrFail($request->produit_id);

        if ($produit->quantite < $request->quantite) {
            return response()->json(['message' => 'Stock insuffisant'], 422);
        }

        $total = $produit->prix * $request->quantite;

        $commande = Commande::create([
            'client_id' => $request->client_id,
            'produit_id' => $request->produit_id,
            'quantite' => $request->quantite,
            'total' => $total,
            'statut' => 'en_attente',
        ]);

        return response()->json($commande->load('client.utilisateur', 'produit'), 201);
    }

    private function assertCommandeBelongsToProducteur(Commande $commande)
    {
        $user = request()->user();
        $producteurId = $this->producteurIdFromUser($user);

        // Si ce n'est pas un producteur connecté, on laisse passer (admin par ex.)
        if (!$producteurId) {
            return;
        }

        $commandeProducteurId = $commande->produit?->producteur?->id;

        if (!$commandeProducteurId || (int)$commandeProducteurId !== (int)$producteurId) {
            abort(403, 'Accès refusé : cette commande ne vous appartient pas.');
        }
    }

    public function show(Commande $commande)
    {
        // Charger la relation produit->producteur avant la vérification
        $commande->load('produit.producteur');
        $this->assertCommandeBelongsToProducteur($commande);

        return response()->json($commande->load('client.utilisateur', 'produit.producteur.utilisateur'));
    }

    public function update(Request $request, Commande $commande)
    {
        $request->validate([
            'statut' => 'sometimes|required|string|in:en_attente,confirmee,en_cours,livree,annulee,refusee',
            'motif_refus' => 'nullable|string|max:500',
            'quantite' => 'sometimes|required|integer|min:1',
        ]);

        if ($request->has('statut')) {
            $newStatus = $request->statut;

            $oldStatus = $commande->statut;

            // 1) Confirmation: on décrémente seulement quand on passe de en_attente -> confirmee
            if ($newStatus === 'confirmee' && $oldStatus === 'en_attente') {
                $produit = $commande->produit;

                if ($produit->quantite < $commande->quantite) {
                    return response()->json(['message' => 'Stock insuffisant pour confirmer'], 422);
                }

                $produit->decrement('quantite', $commande->quantite);
            }

            // 2) Refus: motif_refus obligatoire/logique seulement pour refusee
            if ($newStatus === 'refusee') {
                $commande->motif_refus = $request->input('motif_refus', '');
            } else {
                // éviter de garder un motif de refus précédent
                $commande->motif_refus = null;
            }

            // 3) Annulation / Refus après confirmation: on remonte le stock seulement si l'état précédent était confirmee
            if (in_array($newStatus, ['annulee', 'refusee']) && $oldStatus === 'confirmee') {
                $commande->produit->increment('quantite', $commande->quantite);
            }
        }

        $commande->update($request->only('statut', 'motif_refus', 'quantite'));
        return response()->json($commande->load('client.utilisateur', 'produit'));
    }

    public function destroy(Commande $commande)
    {
        // Protection identique : un producteur ne peut pas supprimer une commande qui ne lui appartient pas
        $commande->load('produit.producteur');
        $this->assertCommandeBelongsToProducteur($commande);

        $commande->delete();
        return response()->json(null, 204);
    }
}

