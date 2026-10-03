<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Producteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

            $utilisateur = Utilisateur::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'mot_de_passe' => Hash::make($request->mot_de_passe),
                'role' => strtolower($request->role)
            ]);

            // CLIENT
            if ($utilisateur->role === 'client') {
                $utilisateur->client()->create([
                    'adresse' => $request->input('adresse', '')
                ]);
            }

            // PRODUCTEUR
            if ($utilisateur->role === 'producteur') {
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
     * LOGIN (email + mot de passe, inchangé — pour client par exemple)
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

        $utilisateur->role = strtolower($utilisateur->role);
        $utilisateur->save();

        $utilisateur->load('client', 'producteur');

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $this->formatUser($utilisateur),
            'token' => $utilisateur->createToken('auth_token')->plainTextToken
        ]);
    }

    /**
     * SEND OTP (producteur) — génère le code et le log dans laravel.log
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string'
        ]);

        $utilisateur = Utilisateur::where('telephone', $request->telephone)
            ->where('role', 'producteur')
            ->first();

        if (!$utilisateur) {
            return response()->json(['message' => 'Aucun producteur trouvé avec ce numéro'], 404);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $utilisateur->otp_code = $code;
        $utilisateur->otp_expires_at = Carbon::now()->addMinutes(5);
        $utilisateur->save();

               Log::info("OTP généré pour le producteur {$utilisateur->telephone} : {$code}");

        $reponse = ['message' => 'Code OTP envoyé'];

        // Mode démo : uniquement en local avec APP_DEBUG=true
        if (app()->environment('local') && config('app.debug')) {
            $reponse['message'] = 'Code OTP généré (mode démo)';
            $reponse['otp_debug'] = $code;
        }

        return response()->json($reponse);
    }

    /**
     * VERIFY OTP (producteur) — vérifie le code et connecte
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'otp' => 'required|string'
        ]);

        $utilisateur = Utilisateur::where('telephone', $request->telephone)
            ->where('role', 'producteur')
            ->first();

        if (!$utilisateur) {
            return response()->json(['message' => 'Aucun producteur trouvé avec ce numéro'], 404);
        }

        if (!$utilisateur->otp_code || !$utilisateur->otp_expires_at) {
            return response()->json(['message' => 'Aucun code OTP demandé'], 400);
        }

        if (Carbon::now()->greaterThan($utilisateur->otp_expires_at)) {
            return response()->json(['message' => 'Code OTP expiré'], 401);
        }

        if ($utilisateur->otp_code !== $request->otp) {
            return response()->json(['message' => 'Code OTP incorrect'], 401);
        }

        // OTP valide -> on le consomme
        $utilisateur->otp_code = null;
        $utilisateur->otp_expires_at = null;
        $utilisateur->save();

        $utilisateur->load('client', 'producteur');

        return response()->json([
            'message' => 'Connexion réussie',
            'utilisateur' => $this->formatUser($utilisateur),
            'token' => $utilisateur->createToken('auth_token')->plainTextToken
        ]);
    }

    /**
     * ME
     */
    public function me(Request $request)
    {
        return response()->json([
            'utilisateur' => $this->formatUser($request->user())
        ]);
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        $request->user()?->tokens()?->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /**
     * FORMAT USER
     */
    private function formatUser(Utilisateur $utilisateur): array
    {
        return [
            'id' => $utilisateur->id,
            'nom' => $utilisateur->nom,
            'email' => $utilisateur->email,
            'role' => $utilisateur->role,

            'client_id' => optional($utilisateur->client)->id,
            'producteur_id' => optional($utilisateur->producteur)->id,

            'client' => $utilisateur->client,
            'producteur' => $utilisateur->producteur,
        ];
    }
}
