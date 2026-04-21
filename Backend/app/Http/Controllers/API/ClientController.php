<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('all')) return response()->json(Client::with('utilisateur')->get());
        return response()->json(Client::with('utilisateur')->paginate($request->input('per_page', 15)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'adresse' => 'nullable|string|max:255'
        ]);

        $client = Client::create($request->only(['utilisateur_id', 'adresse']));
        return response()->json($client->load('utilisateur'), 201);
    }

    public function show(Client $client)
    {
        return response()->json($client->load('utilisateur', 'commandes'));
    }

    public function update(Request $request, Client $client)
    {
        $request->validate([
            'utilisateur_id' => 'sometimes|required|exists:utilisateurs,id',
            'adresse' => 'nullable|string|max:255'
        ]);

        $client->update($request->only(['utilisateur_id', 'adresse']));
        return response()->json($client->load('utilisateur'));
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }
}