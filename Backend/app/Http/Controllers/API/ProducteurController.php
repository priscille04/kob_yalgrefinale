<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Producteur;
use Illuminate\Http\Request;
use App\Models\Utilisateur;  
use App\Models\Boutique;

class ProducteurController extends Controller
{
    // LISTE
       public function index(Request $request)
{
    $producteurs = Producteur::with('utilisateur', 'boutique')->get();

    return response()->json($producteurs);
}

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'producteur_id' => 'required|exists:utilisateurs,id',
            'type_culture' => 'nullable|string|max:255',
            'localisation' => 'nullable|string|max:255'
        ]);

        $producteur = Producteur::create([
            'producteur_id' => $request->utilisateur_id,
            'type_culture' => $request->type_culture,
            'localisation' => $request->localisation
        ]);

        return response()->json(
            $producteur->load('utilisateur')
        , 201);
    }

    // SHOW
    public function show(Producteur $producteur)
    {
        return response()->json(
            $producteur->load('utilisateur', 'produits', 'annonces')
        );
    }

    // UPDATE
    public function update(Request $request, Producteur $producteur)
    {
        $request->validate([
            'producteur_id' => 'sometimes|required|exists:utilisateurs,id',
            'type_culture' => 'nullable|string|max:255',
            'localisation' => 'nullable|string|max:255'
        ]);

        $producteur->update([
            'producteur_id' => $request->utilisateur_id ?? $producteur->utilisateur_id,
            'type_culture' => $request->type_culture,
            'localisation' => $request->localisation
        ]);

        return response()->json(
            $producteur->load('utilisateur')
        );
    }

    // DELETE
    public function destroy(Producteur $producteur)
    {
        $producteur->delete();
        return response()->json(['message' => 'Supprimé avec succès']);
    }

}