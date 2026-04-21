<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Producteur;
use Illuminate\Http\Request;

class ProducteurController extends Controller
{
    public function index()
    {
        return response()->json(Producteur::with('utilisateur')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'type_culture' => 'nullable|string|max:255',
            'localisation' => 'nullable|string|max:255'
        ]);

        $producteur = Producteur::create($request->all());
        return response()->json($producteur->load('utilisateur'), 201);
    }

    public function show(Producteur $producteur)
    {
        return response()->json($producteur->load('utilisateur', 'produits', 'annonces'));
    }

    public function update(Request $request, Producteur $producteur)
    {
        $request->validate([
            'utilisateur_id' => 'sometimes|required|exists:utilisateurs,id',
            'type_culture' => 'nullable|string|max:255',
            'localisation' => 'nullable|string|max:255'
        ]);

        $producteur->update($request->all());
        return response()->json($producteur->load('utilisateur'));
    }

    public function destroy(Producteur $producteur)
    {
        $producteur->delete();
        return response()->json(null, 204);
    }
}