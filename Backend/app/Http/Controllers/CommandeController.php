<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommandeController extends Controller
{
    private function getProducteurId()
    {
        $user = request()->user();

        if ($user && $user->relationLoaded('producteur')) {
            return $user->producteur?->id;
        }

        if ($user && isset($user->producteur)) {
            return $user->producteur->id;
        }

        return $user?->producteur_id;
    }

    private function getClientId()
    {
        $user = request()->user();

        if ($user && $user->relationLoaded('client')) {
            return $user->client?->id;
        }

        if ($user && isset($user->client)) {
            return $user->client->id;
        }

        return $user?->client_id;
    }

    private function scopeUserRoleAccess($query)
    {
        $user = request()->user();

        if (!$user) {
            return $query;
        }

        // Cas 1 : Si c'est un producteur, il ne voit que les commandes de SES produits
        $producteurId = $this->getProducteurId();
        if ($producteurId) {
            return $query->whereHas('produit', function ($q) use ($producteurId) {
                $q->where('producteur_id', $producteurId);
            });
        }

        // Cas 2 : Si c'est un client (Flutter / Web), il ne voit que SES propres commandes
        $clientId = $this->getClientId();
        if ($clientId) {
            return $query->where('client_id', $clientId);
        }

        return $query;
    }

    public function index(Request $request)
    {
        $query = Commande::with(['client.utilisateur', 'produit.producteur.utilisateur']);

        // Sécurise l'accès selon le rôle (Client ou Producteur)
        $this->scopeUserRoleAccess($query);

        // Filtres optionnels additionnels
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('produit_id')) {
            $query->where('produit_id', $request->produit_id);
        }

        if ($request->filled('reference_panier')) {
            $query->where('reference_panier', $request->reference_panier);
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
        // Si l'utilisateur est connecté en tant que client, on force son client_id automatiquement
        $clientId = $this->getClientId();

        if ($clientId) {
            $request->merge(['client_id' => $clientId]);
        }

        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1',
        ]);

        $produit = Produit::findOrFail($request->produit_id);

        if ($produit->quantite < $request->quantite) {
            return response()->json(['message' => 'Stock insuffisant'], 422);
        }

        $commande = Commande::create([
            'client_id' => $request->client_id,
            'produit_id' => $request->produit_id,
            'quantite' => $request->quantite,
            'total' => $produit->prix * $request->quantite,
            'statut' => 'en_attente',
        ]);

        // Décrémenter le stock du produit après la commande réussie
        $produit->decrement('quantite', $request->quantite);

        return response()->json(
            $commande->load(['client.utilisateur', 'produit.producteur.utilisateur']),
            201
        );
    }

    /**
     * Valide un panier contenant plusieurs produits en une seule requête.
     * Crée une commande par produit (même structure que store()),
     * toutes reliées par une même reference_panier pour pouvoir
     * être regroupées à l'affichage (client, producteur, admin).
     *
     * Payload attendu :
     * {
     *   "articles": [
     *     { "produit_id": 1, "quantite": 2 },
     *     { "produit_id": 5, "quantite": 1 }
     *   ]
     * }
     */
    public function storePanier(Request $request)
    {
        $clientId = $this->getClientId();

        if (!$clientId) {
            return response()->json([
                'message' => 'Aucun profil client associé à cet utilisateur.'
            ], 404);
        }

        $request->validate([
            'articles'              => 'required|array|min:1',
            'articles.*.produit_id' => 'required|exists:produits,id',
            'articles.*.quantite'   => 'required|integer|min:1',
        ]);

        // Vérifie le stock de tous les articles AVANT de créer quoi que ce soit
        $produits = [];
        foreach ($request->articles as $article) {
            $produit = Produit::findOrFail($article['produit_id']);

            if ($produit->quantite < $article['quantite']) {
                return response()->json([
                    'message' => "Stock insuffisant pour le produit : {$produit->nom}"
                ], 422);
            }

            $produits[] = ['produit' => $produit, 'quantite' => $article['quantite']];
        }

        $referencePanier = (string) Str::uuid();

        $commandesCreees = DB::transaction(function () use ($produits, $clientId, $referencePanier) {
            $commandes = [];

            foreach ($produits as $item) {
                $produit = $item['produit'];
                $quantite = $item['quantite'];

                $commandes[] = Commande::create([
                    'reference_panier' => $referencePanier,
                    'client_id'        => $clientId,
                    'produit_id'       => $produit->id,
                    'quantite'         => $quantite,
                    'total'            => $produit->prix * $quantite,
                    'statut'           => 'en_attente',
                ]);

                // Décrémenter le stock, comme dans store()
                $produit->decrement('quantite', $quantite);
            }

            return $commandes;
        });

        $collection = collect($commandesCreees)->load(['client.utilisateur', 'produit.producteur.utilisateur']);

        return response()->json([
            'reference_panier' => $referencePanier,
            'total_general'    => $collection->sum('total'),
            'commandes'        => $collection,
        ], 201);
    }

    public function show(Commande $commande)
    {
        // Vérification de sécurité pour éviter qu'un client lise la commande d'un autre
        $clientId = $this->getClientId();
        if ($clientId && $commande->client_id !== $clientId) {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        $commande->load(['client.utilisateur', 'produit.producteur.utilisateur']);

        return response()->json($commande);
    }

    public function update(Request $request, Commande $commande)
    {
        $request->validate([
            'statut' => 'sometimes|string',
            'quantite' => 'sometimes|integer|min:1',
        ]);

        $commande->update($request->only('statut', 'quantite'));

        return response()->json($commande->load(['client.utilisateur', 'produit.producteur.utilisateur']));
    }

    public function destroy(Commande $commande)
    {
        // Sécurité client
        $clientId = $this->getClientId();
        if ($clientId && $commande->client_id !== $clientId) {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        $commande->delete();
        return response()->json(null, 204);
    }
}