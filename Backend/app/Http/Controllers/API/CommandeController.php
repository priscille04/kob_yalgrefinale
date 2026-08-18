<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    private function getProducteurId()
    {
        $user = request()->user();

        // cas 1 : relation producteur
        if ($user && $user->relationLoaded('producteur')) {
            return $user->producteur?->id;
        }

        // cas 2 : relation directe
        if ($user && isset($user->producteur)) {
            return $user->producteur->id;
        }

        // cas 3 : fallback (très important)
        return $user?->producteur_id;
    }

    private function scopeProducteurAccess($query)
    {
        $producteurId = $this->getProducteurId();

        if ($producteurId) {
            $query->whereHas('produit', function ($q) use ($producteurId) {
                $q->where('producteur_id', $producteurId);
            });
        }

        return $query;
    }

    public function index(Request $request)
    {
        $query = Commande::with('client.utilisateur', 'produit.producteur.utilisateur');

        //  sécurise accès producteur
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

        if ($request->has('all')) {
            return response()->json($query->latest()->get());
        }

        return response()->json(
            $query->latest()->paginate($request->input('per_page', 15))
        );
    }

   public function store(Request $request)
{
    $request->validate([
        'produit_id' => 'required|exists:produits,id',
        'quantite'   => 'required|integer|min:1',
    ]);

    // Utilisateur connecté grâce au token Sanctum
    $utilisateur = $request->user();

    if (!$utilisateur) {
        return response()->json([
            'message' => 'Utilisateur non authentifié.'
        ], 401);
    }

    // Récupération du client lié à cet utilisateur
    $client = $utilisateur->client;

    if (!$client) {
        return response()->json([
            'message' => 'Aucun profil client associé à cet utilisateur.'
        ], 404);
    }

    $produit = Produit::findOrFail($request->produit_id);

    // Vérification du stock
    if ($produit->quantite < $request->quantite) {
        return response()->json([
            'message' => 'Stock insuffisant.'
        ], 422);
    }

    $commande = Commande::create([
        'client_id'  => $client->id,
        'produit_id' => $produit->id,
        'quantite'   => $request->quantite,
        'total'      => $produit->prix * $request->quantite,
        'statut'     => 'en_attente',
    ]);

    return response()->json(
        $commande->load('client.utilisateur', 'produit.producteur.utilisateur'),
        201
    );
}

    public function show(Commande $commande)
    {
        $commande->load('produit.producteur');

        return response()->json($commande);
    }

    public function update(Request $request, Commande $commande)
    {
        $request->validate([
            'statut' => 'sometimes|string',
            'quantite' => 'sometimes|integer|min:1',
        ]);

        $commande->update($request->only('statut', 'quantite'));

        return response()->json($commande);
    }

    public function destroy(Commande $commande)
    {
        $commande->delete();

        return response()->json(null, 204);
    }
public function mesCommandes(Request $request)
{
    $utilisateur = $request->user();

    if (!$utilisateur) {
        return response()->json([
            'message' => 'Utilisateur non connecté'
        ], 401);
    }

    $client = $utilisateur->client;

    if (!$client) {
        return response()->json([
            'message' => 'Aucun profil client associé'
        ], 404);
    }

    $commandes = Commande::with('produit')
        ->where('client_id', $client->id)
        ->latest()
        ->get();

    return response()->json($commandes);
}
}