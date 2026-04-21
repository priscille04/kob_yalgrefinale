<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index()
    {
        return response()->json(Produit::with('producteur', 'typeProduit')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'producteur_id' => 'required|exists:producteurs,id',
            'typeproduit_id' => 'nullable|exists:typeproduits,id',
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantite' => 'required|integer|min:0',
            'prix' => 'required|numeric|min:0'
        ]);

        $produit = Produit::create($request->all());
        return response()->json($produit->load('producteur', 'typeProduit'), 201);
    }

    public function show(Produit $produit)
    {
        return response()->json($produit->load('producteur', 'typeProduit', 'commandes'));
    }

    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'producteur_id' => 'sometimes|required|exists:producteurs,id',
            'typeproduit_id' => 'nullable|exists:typeproduits,id',
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'quantite' => 'sometimes|required|integer|min:0',
            'prix' => 'sometimes|required|numeric|min:0'
        ]);

        $produit->update($request->all());
        return response()->json($produit->load('producteur', 'typeProduit'));
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();
        return response()->json(null, 204);
    }
}