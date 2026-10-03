<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\AdminOtpMail;
use App\Mail\AdminPasswordMail;
use App\Models\AdminOtp;
use App\Models\Utilisateur;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Mode démo : uniquement en local ET avec APP_DEBUG=true.
     * En production, cette méthode renvoie toujours false.
     */
    private function isDemoMode(): bool
    {
        return app()->environment('local') && config('app.debug');
    }

    public function resetAdminPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:utilisateurs,email',
        ]);

        $admin = Utilisateur::where('email', $request->email)->first();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Utilisateur admin introuvable'], 404);
        }

        $plainPassword = Str::random(12);

        $admin->mot_de_passe = Hash::make($plainPassword);
        $admin->save();

        // Mode démo : on renvoie le mot de passe dans la réponse (jamais en production)
        if ($this->isDemoMode()) {
            return response()->json([
                'message' => 'Mot de passe généré (mode démo, pas d’envoi email)',
                'plainPassword' => $plainPassword,
            ], 200);
        }

        try {
            Mail::to($admin->email)->send(new AdminPasswordMail($plainPassword));
        } catch (\Throwable $e) {
            Log::error('AdminPasswordMail failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Mot de passe généré, mais l’envoi email a échoué'
            ], 500);
        }

        return response()->json(['message' => 'Nouveau mot de passe envoyé par email'], 200);
    }

    /**
     * STEP 1: génère et envoie l'OTP admin.
     *
     * POST /api/v1/admin/login/start-otp
     * Body: { email: string }
     */
    public function startOtpForAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur || $utilisateur->role !== 'admin') {
            Log::warning('Admin OTP start: user not found or role not admin', [
                'email' => $request->email,
                'role' => $utilisateur?->role,
            ]);
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $otp = (string) random_int(100000, 999999);

        $otpHash = Hash::make($otp);
        $expiresAt = Carbon::now()->addMinutes(5);

        // Supprime les OTP expirés
        AdminOtp::where('email', $utilisateur->email)
            ->where('expires_at', '<', Carbon::now())
            ->delete();

        AdminOtp::create([
            'email' => $utilisateur->email,
            'otp_hash' => $otpHash,
            'expires_at' => $expiresAt,
            'attempts' => 0,
        ]);

        // Mode démo : le code est renvoyé dans la réponse (affiché en bas de l'écran)
        if ($this->isDemoMode()) {
            Log::info('ADMIN OTP (démo): email=' . $utilisateur->email . ' otp=' . $otp);

            return response()->json([
                'message' => 'Code OTP généré (mode démo)',
                'otp_debug' => $otp,
                'expiresAt' => $expiresAt->toISOString(),
            ], 200);
        }

        // Production : envoi par email uniquement
        try {
            Mail::to($utilisateur->email)->send(new AdminOtpMail($otp));
        } catch (\Throwable $e) {
            Log::error('AdminOtpMail failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Le code a été généré, mais l’envoi de l’email a échoué',
            ], 500);
        }

        return response()->json([
            'message' => 'Code OTP envoyé par email',
            'expiresAt' => $expiresAt->toISOString(),
        ], 200);
    }

    /**
     * STEP 2: Vérifie l'OTP saisi et renvoie le token Sanctum.
     *
     * POST /api/v1/admin/login/verify-otp
     * Body: { email: string, otp: string }
     */
    public function verifyOtpForAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $adminOtp = AdminOtp::where('email', $request->email)
            ->where('expires_at', '>=', Carbon::now())
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$adminOtp) {
            return response()->json(['message' => 'Code OTP invalide ou expiré'], 401);
        }

        // Protection contre les essais en boucle (6 chiffres = 1 million de combinaisons)
        if ($adminOtp->attempts >= 5) {
            $adminOtp->delete();
            return response()->json(['message' => 'Trop d’essais, demandez un nouveau code'], 429);
        }

        if (!Hash::check($request->otp, $adminOtp->otp_hash)) {
            $adminOtp->increment('attempts');
            return response()->json(['message' => 'Code OTP incorrect'], 401);
        }

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        // OTP valide => supprimer tous les OTP de cet email
        AdminOtp::where('email', $utilisateur->email)->delete();

        $utilisateur->load('client', 'producteur');

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion admin réussie',
            'utilisateur' => $utilisateur,
            'token' => $token,
        ]);
    }
}