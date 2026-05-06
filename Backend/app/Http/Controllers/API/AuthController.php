<?php
 namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
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
                // Admin n’est pas choisi manuellement
                'role' => 'required|in:client,producteur'
            ]);

            // Déterminer le rôle et mot de passe
            $role = $request->role;
            $motDePasse = $request->mot_de_passe;

            // Si l'email contient "admin", forcer admin
            if (str_contains(strtolower($request->email), 'admin@kobyalgre.bf')) {
                $role = 'admin';
                $motDePasse = 'admin1234'; // mot de passe forcé
            }

            $utilisateur = Utilisateur::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'mot_de_passe' => Hash::make($motDePasse),
                'role' => $role
            ]);

            // Auto-créer le profil Client ou Producteur
            if ($role === 'client') {
                $utilisateur->client()->create(['adresse' => $request->input('adresse', '')]);
            } elseif ($role === 'producteur') {
                $utilisateur->producteur()->create([
                    'type_culture' => $request->input('type_culture', ''),
                    'localisation' => $request->input('localisation', ''),
                ]);
            }

            $utilisateur->load('client', 'producteur');

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'utilisateur' => $this->formatUser($utilisateur),
                'token' => $utilisateur->createToken('auth_token')->plainTextToken
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'inscription: ' . $e->getMessage()
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
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }

        if (!Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json([
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        $utilisateur->load('client', 'producteur');

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $this->formatUser($utilisateur),
            'token' => $utilisateur->createToken('auth_token')->plainTextToken
        ]);
    }

    /**
     * USER CONNECTÉ
     */
    public function me(Request $request)
    {
        $utilisateur = $request->user();
        $utilisateur->load('client', 'producteur');
        return response()->json($this->formatUser($utilisateur));
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

    /**
     * Formater l'utilisateur avec client_id / producteur_id
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