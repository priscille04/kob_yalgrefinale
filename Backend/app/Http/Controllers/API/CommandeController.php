<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        $query = Commande::with('client.utilisateur', 'produit.producteur.utilisateur');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('produit_id')) {
            $query->where('produit_id', $request->produit_id);
        }

        return response()->json($query->latest()->get());
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

    public function show(Commande $commande)
    {
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

            if ($newStatus === 'confirmee' && $commande->statut === 'en_attente') {
                $produit = $commande->produit;
                if ($produit->quantite < $commande->quantite) {
                    return response()->json(['message' => 'Stock insuffisant pour confirmer'], 422);
                }
                $produit->decrement('quantite', $commande->quantite);
            }

            if ($newStatus === 'refusee') {
                $commande->motif_refus = $request->input('motif_refus', '');
            }

            if (in_array($newStatus, ['annulee', 'refusee']) && $commande->statut === 'confirmee') {
                $commande->produit->increment('quantite', $commande->quantite);
            }
        }

        $commande->update($request->only('statut', 'motif_refus', 'quantite'));
        return response()->json($commande->load('client.utilisateur', 'produit'));
    }

    public function destroy(Commande $commande)
    {
        $commande->delete();
        return response()->json(null, 204);
    }
}