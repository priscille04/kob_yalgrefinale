<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TypeProduit;
use Illuminate\Http\Request;

class TypeProduitController extends Controller
{
    public function index()
    {
        return response()->json(TypeProduit::with('produits')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:typeproduits'
        ]);

        $typeProduit = TypeProduit::create($request->all());
        return response()->json($typeProduit, 201);
    }

    public function show(TypeProduit $typeProduit)
    {
        return response()->json($typeProduit->load('produits'));
    }

    public function update(Request $request, TypeProduit $typeProduit)
    {
        $request->validate([
            'nom' => 'sometimes|required|string|max:255|unique:typeproduits,nom,' . $typeProduit->id
        ]);

        $typeProduit->update($request->all());
        return response()->json($typeProduit);
    }

    public function destroy(TypeProduit $typeProduit)
    {
        $typeProduit->delete();
        return response()->json(null, 204);
    }
}