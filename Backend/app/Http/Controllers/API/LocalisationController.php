<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Localisation;
use Illuminate\Http\Request;

class LocalisationController extends Controller
{
    public function index()
    {
        return response()->json(Localisation::with('utilisateur')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'ville' => 'required|string|max:255',
            'longitude' => 'nullable|string|max:255',
            'latitude' => 'nullable|string|max:255'
        ]);

        $localisation = Localisation::create($request->all());
        return response()->json($localisation->load('utilisateur'), 201);
    }

    public function show(Localisation $localisation)
    {
        return response()->json($localisation->load('utilisateur'));
    }

    public function update(Request $request, Localisation $localisation)
    {
        $request->validate([
            'utilisateur_id' => 'sometimes|required|exists:utilisateurs,id',
            'ville' => 'sometimes|required|string|max:255',
            'longitude' => 'nullable|string|max:255',
            'latitude' => 'nullable|string|max:255'
        ]);

        $localisation->update($request->all());
        return response()->json($localisation->load('utilisateur'));
    }

    public function destroy(Localisation $localisation)
    {
        $localisation->delete();
        return response()->json(null, 204);
    }
}