<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TypeProduit;
use Illuminate\Http\Request;

class TypeProduitController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('all')) return response()->json(TypeProduit::with('produits')->get());
        return response()->json(TypeProduit::with('produits')->paginate($request->input('per_page', 15)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:typeproduits'
        ]);

        $typeProduit = TypeProduit::create($request->only(['nom']));
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

        $typeProduit->update($request->only(['nom']));
        return response()->json($typeProduit);
    }

    public function destroy(TypeProduit $typeProduit)
    {
        $typeProduit->delete();
        return response()->json(null, 204);
    }
}