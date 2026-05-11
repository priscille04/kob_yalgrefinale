<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Boutique;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Producteur;

class BoutiqueController extends Controller
{
    public function index()
    {
        return response()->json(Boutique::all());
    }

   public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'code_unique' => 'required|string|max:255|unique:boutiques',
        'ville' => 'nullable|string|max:255',
        'producteur_id' => 'required|exists:producteurs,id'
    ]);

    // 1. créer boutique
    $boutique = Boutique::create([
        'nom' => $request->nom,
        'code_unique' => $request->code_unique,
        'ville' => $request->ville
    ]);

    // 2. affecter producteur
    $producteur = Producteur::find($request->producteur_id);

    $producteur->update([
        'boutique_id' => $boutique->id
    ]);

    return response()->json([
        'message' => 'Boutique créée et assignée au producteur',
        'boutique' => $boutique,
        'producteur' => $producteur
    ], 201);
}
    public function show(Boutique $boutique)
    {
        return response()->json($boutique);
    }

    public function destroy(Boutique $boutique)
    {
        $boutique->delete();
        return response()->json(null, 204);
    }
   public function update(Request $request, $id)
{
    $boutique = Boutique::findOrFail($id);

    $request->validate([
        'nom' => 'required|string|max:255',
    ]);

    $boutique->update([
        'nom' => $request->nom,
    ]);

    return response()->json($boutique);
}
}
