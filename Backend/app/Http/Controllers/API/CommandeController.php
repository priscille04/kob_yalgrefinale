<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index()
    {
        return response()->json(Commande::with('client', 'produit')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
            'statut' => 'required|string|in:en_attente,en_cours,livree,annulee'
        ]);

        $commande = Commande::create($request->all());
        return response()->json($commande->load('client', 'produit'), 201);
    }

    public function show(Commande $commande)
    {
        return response()->json($commande->load('client', 'produit'));
    }

    public function update(Request $request, Commande $commande)
    {
        $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'produit_id' => 'sometimes|required|exists:produits,id',
            'quantite' => 'sometimes|required|integer|min:1',
            'total' => 'sometimes|required|numeric|min:0',
            'statut' => 'sometimes|required|string|in:en_attente,en_cours,livree,annulee'
        ]);

        $commande->update($request->all());
        return response()->json($commande->load('client', 'produit'));
    }

    public function destroy(Commande $commande)
    {
        $commande->delete();
        return response()->json(null, 204);
    }
}