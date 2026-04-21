<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use Illuminate\Http\Request;

class AnnonceController extends Controller
{
    public function index()
    {
        return response()->json(Annonce::with('producteur')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'producteur_id' => 'required|exists:producteurs,id',
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string'
        ]);

        $annonce = Annonce::create($request->all());
        return response()->json($annonce->load('producteur'), 201);
    }

    public function show(Annonce $annonce)
    {
        return response()->json($annonce->load('producteur'));
    }

    public function update(Request $request, Annonce $annonce)
    {
        $request->validate([
            'producteur_id' => 'sometimes|required|exists:producteurs,id',
            'titre' => 'sometimes|required|string|max:255',
            'contenu' => 'sometimes|required|string'
        ]);

        $annonce->update($request->all());
        return response()->json($annonce->load('producteur'));
    }

    public function destroy(Annonce $annonce)
    {
        $annonce->delete();
        return response()->json(null, 204);
    }
}