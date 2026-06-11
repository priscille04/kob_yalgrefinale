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

            // IMPORTANT: pas d’admin auto basé sur l’email.
            // La création d’admins doit être faite via seeder/commande admin sécurisé.


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

            // PRODUCTEUR + BOUTIQUE
            // Important : le front fait ensuite un `check-boutique` => il faut que `boutique_id` soit bien rempli.
            if ($role === 'producteur') {
                // Optionnel mais recommandé : exiger le code boutique ici pour éviter les comptes “producteur” incomplets.
                $request->validate([
                    'code_boutique' => 'required'
                ]);

                $boutique = Boutique::where('code_unique', $request->code_boutique)->first();

                if (!$boutique) {
                    return response()->json([
                        'message' => 'Code boutique invalide'
                    ], 422);
                }

                $utilisateur->producteur()->create([
                    'boutique_id' => $boutique->id,
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
     * Resolve role by email (admin vs producteur)
     * Body: { email: string }
     */
    public function resolveRole(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur) {
            return response()->json([
                'role' => 'none'
            ], 404);
        }

        return response()->json([
            'role' => $utilisateur->role
        ], 200);
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
    /*CHECK BOUTIQUE
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

    /*
     ME (pour /api/auth/me)
     */
    public function me(Request $request)
    {
        return response()->json([
            'utilisateur' => $this->formatUser($request->user())
        ]);
    }

    /*
      LOGOUT (pour /api/auth/logout)
     */
    public function logout(Request $request)
    {
        // invalide tous les tokens de l’utilisateur courant
        $request->user()?->tokens()?->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /*REFRESH TOKEN (pour /api/auth/refresh)
     */
    public function refreshToken(Request $request)
    {
        $token = $request->user()->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'utilisateur' => $this->formatUser($request->user())
        ]);
    }

    /*FORMAT USER
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

