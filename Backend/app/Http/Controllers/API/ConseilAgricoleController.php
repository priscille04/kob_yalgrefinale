<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ConseilAgricole;
use Illuminate\Http\Request;

class ConseilAgricoleController extends Controller
{
    public function index()
    {
        return response()->json(ConseilAgricole::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string'
        ]);

        $conseil = ConseilAgricole::create($request->all());
        return response()->json($conseil, 201);
    }

    public function show(ConseilAgricole $conseilAgricole)
    {
        return response()->json($conseilAgricole);
    }

    public function update(Request $request, ConseilAgricole $conseilAgricole)
    {
        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'contenu' => 'sometimes|required|string'
        ]);

        $conseilAgricole->update($request->all());
        return response()->json($conseilAgricole);
    }

    public function destroy(ConseilAgricole $conseilAgricole)
    {
        $conseilAgricole->delete();
        return response()->json(null, 204);
    }
}