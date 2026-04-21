<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * REGISTER
     */
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:utilisateurs',
            'telephone' => 'nullable|string|max:255',
            'mot_de_passe' => 'required|string|min:6',
            'role' => 'required|in:client,producteur,admin'
        ]);

        $utilisateur = Utilisateur::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'utilisateur' => $utilisateur,
            'token' => $utilisateur->createToken('auth_token')->plainTextToken
        ], 201);
    }

    /**
     * LOGIN
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'mot_de_passe' => 'required|string'
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        if (!Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json([
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $utilisateur,
            'token' => $utilisateur->createToken('auth_token')->plainTextToken
        ]);
    }

    /**
     * USER CONNECTÉ
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * REFRESH TOKEN
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Token rafraîchi avec succès',
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }
}