<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // 1. SÉCURITÉ CRUCIALE : On vérifie si l'utilisateur est authentifié
            $userConnected = $request->user();

            if (!$userConnected) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401); // Renvoie un 401 propre et empêche le crash 500
            }

            // 2. Initialisation de la requête de base
            $query = Utilisateur::query();

            // 3. Gestion du filtre ?all=true demandé par React
            if ($request->has('all') && $request->input('all') == 'true') {
                return response()->json($query->latest()->get());
            }

            // Gestion de la pagination par défaut
            return response()->json(
                $query->latest()->paginate($request->input('per_page', 15))
            );

        } catch (\Exception $e) {
            // Capture toute autre erreur interne pour éviter de faire planter l'application
            return response()->json([
                'success' => false,
                'message' => 'Une erreur interne est survenue.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:251',
            'email' => 'required|string|email|max:251|unique:utilisateurs',
            'telephone' => 'nullable|string',
            'mot_de_passe' => 'required|string|min:6',
            'role' => 'required|string',
        ]);

        $utilisateur = Utilisateur::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'mot_de_passe' => bcrypt($request->mot_de_passe),
            'role' => $request->role,
        ]);

        return response()->json($utilisateur, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        return response()->json($utilisateur);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $request->validate([
            'nom' => 'sometimes|string|max:251',
            'email' => 'sometimes|string|email|max:251|unique:utilisateurs,email,' . $id,
            'telephone' => 'nullable|string',
            'role' => 'sometimes|string',
        ]);

        $utilisateur->update($request->only('nom', 'email', 'telephone', 'role'));

        if ($request->filled('mot_de_passe')) {
            $utilisateur->update(['mot_de_passe' => bcrypt($request->mot_de_passe)]);
        }

        return response()->json($utilisateur);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $utilisateur->delete();
        return response()->json(null, 204);
    }
}
