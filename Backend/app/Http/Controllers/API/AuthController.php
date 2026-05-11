<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Boutique;
use App\Models\Producteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * REGISTER
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:utilisateurs',
                'telephone' => 'nullable|string|max:255',
                'mot_de_passe' => 'required|string|min:6',
                'role' => 'required|in:client,producteur'
            ]);

            $role = $request->role;
            $motDePasse = $request->mot_de_passe;

            // admin auto
            if (str_contains(strtolower($request->email), 'admin@kobyalgre.bf')) {
                $role = 'admin';
                $motDePasse = 'admin1234';
            }

            $utilisateur = Utilisateur::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'mot_de_passe' => Hash::make($motDePasse),
                'role' => $role
            ]);

            // CLIENT
            if ($role === 'client') {
                $utilisateur->client()->create([
                    'adresse' => $request->input('adresse', '')
                ]);
            }

            // PRODUCTEUR (sans boutique ici)
            if ($role === 'producteur') {
                $utilisateur->producteur()->create([
                    'type_culture' => $request->input('type_culture', ''),
                    'localisation' => $request->input('localisation', '')
                ]);
            }

            $utilisateur->load('client', 'producteur');

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'utilisateur' => $this->formatUser($utilisateur),
                'token' => $utilisateur->createToken('auth_token')->plainTextToken
            ], 201);

        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
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
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        if (!Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json(['message' => 'Mot de passe incorrect'], 401);
        }

        $utilisateur->load('client', 'producteur');

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $this->formatUser($utilisateur),
            'token' => $utilisateur->createToken('auth_token')->plainTextToken
        ]);
    }

    /**
     * REGISTER PRODUCTEUR + BOUTIQUE (IMPORTANT)
     */
   public function registerProducteur(Request $request)
{
    $request->validate([
        'nom' => 'required',
        'email' => 'required|email|unique:utilisateurs',
        'password' => 'required|min:6',
        'code_boutique' => 'required'
    ]);

    $boutique = Boutique::where('code_unique', $request->code_boutique)->first();

    if (!$boutique) {
        return response()->json([
            'message' => 'Code boutique invalide'
        ], 422);
    }

    $user = Utilisateur::create([
        'nom' => $request->nom,
        'email' => $request->email,
        'mot_de_passe' => Hash::make($request->password),
        'role' => 'producteur'
    ]);

    $producteur = Producteur::create([
        'utilisateur_id' => $user->id,
        'boutique_id' => $boutique->id,
        'type_culture' => '',
        'localisation' => ''
    ]);

    return response()->json([
        'user' => $user,
        'producteur' => $producteur,
        'boutique' => $boutique
    ], 201);
}
    /**
     * CHECK BOUTIQUE
     */
   public function checkBoutique(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:utilisateurs,id',
        'code_boutique' => 'required'
    ]);

    $user = Utilisateur::with('producteur.boutique')->find($request->user_id);

    if (!$user || !$user->producteur) {
        return response()->json([
            'message' => 'Utilisateur non producteur'
        ], 400);
    }

    if (!$user->producteur->boutique) {
        return response()->json([
            'message' => 'Aucune boutique liée à ce producteur'
        ], 400);
    }

    if ($user->producteur->boutique->code_unique !== $request->code_boutique) {
        return response()->json([
            'message' => 'Code incorrect'
        ], 403);
    }

    return response()->json([
        'message' => 'OK'
    ]);
}

    /**
     * FORMAT USER
     */
    private function formatUser(Utilisateur $utilisateur): array
    {
        $data = $utilisateur->toArray();
        $data['client_id'] = $utilisateur->client?->id;
        $data['producteur_id'] = $utilisateur->producteur?->id;

        unset($data['client'], $data['producteur']);

        return $data;
    }
}