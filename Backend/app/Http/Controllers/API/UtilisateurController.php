<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Boutique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('all')) {
            return response()->json(Utilisateur::all());
        }

        return response()->json(
            Utilisateur::paginate($request->input('per_page', 15))
        );
    }

   public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:utilisateurs',
        'telephone' => 'nullable|string|max:255',
        'mot_de_passe' => 'required|string|min:8',
        'role' => 'required|string|in:client,producteur',
        'code_boutique' => 'nullable|string'
    ]);

    $boutique_id = null;

    if ($request->role === 'producteur') {

        if (!$request->code_boutique) {
            return response()->json([
                'message' => 'Code boutique requis pour un producteur'
            ], 422);
        }

        $boutique = \App\Models\Boutique::where('code_unique', $request->code_boutique)->first();

        if (!$boutique) {
            return response()->json([
                'message' => 'Code boutique invalide'
            ], 422);
        }

        // IMPORTANT : on récupère bien l'id
        $boutique_id = $boutique->id;
    }


        $utilisateur = Utilisateur::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'role' => $request->role,
            'boutique_id' => $boutique_id
        ]);

        return response()->json($utilisateur, 201);
    }

    public function show(Utilisateur $utilisateur)
    {
        return response()->json($utilisateur);
    }

    public function update(Request $request, Utilisateur $utilisateur)
    {
        $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:utilisateurs,email,' . $utilisateur->id,
            'telephone' => 'nullable|string|max:255',
            'mot_de_passe' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|required|string|in:client,producteur,admin'
        ]);

        if ($request->has('mot_de_passe')) {
            $request->merge([
                'mot_de_passe' => Hash::make($request->mot_de_passe)
            ]);
        }

        $utilisateur->update(
            $request->only('nom', 'email', 'telephone', 'mot_de_passe', 'role')
        );

        return response()->json($utilisateur);
    }

    public function destroy(Utilisateur $utilisateur)
    {
        $utilisateur->delete();
        return response()->json(null, 204);
    }
}