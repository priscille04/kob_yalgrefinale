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
     * Request body: { email: string }
     * (Legacy) Mot de passe temporaire admin par email.
     * Pour la connexion OTP, utilisez startOtpForAdmin / verifyOtpForAdmin.
     */

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

        // Dev fallback: if MAIL_MAILER=log (or APP_DEBUG=true), return plaintext
        // so you can login without an email account.
        $mailMailer = (string) env('MAIL_MAILER', 'log');
        $appDebug = (bool) env('APP_DEBUG', false);

        if ($appDebug || $mailMailer === 'log') {
            return response()->json([
                'message' => 'Mot de passe généré (mode dev, pas d’envoi email)',
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
     * STEP 1: Vérifie email + mot_de_passe admin, génère un OTP et l’envoie par email.
     *
     * POST /api/v1/admin/login/start-otp
     * Body: { email: string, mot_de_passe: string }
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




        // Flow OTP uniquement : le message envoyé par email contient directement le code OTP.
        // Donc aucun mot de passe n’est requis/validé ici.




        $otp = (string) random_int(100000, 999999);




        $otpHash = Hash::make($otp);
        $expiresAt = Carbon::now()->addMinutes(5);

        // Supprime les OTP trop vieux (et nettoie ceux déjà valides/derniers en pratique).
        AdminOtp::where('email', $utilisateur->email)
            ->where('expires_at', '<', Carbon::now())
            ->delete();

        AdminOtp::create([
            'email' => $utilisateur->email,
            'otp_hash' => $otpHash,
            'expires_at' => $expiresAt,
            'attempts' => 0,
        ]);

        try {
            // Debug: si SMTP ne fonctionne pas, au moins on voit l’OTP.
            Log::info('ADMIN OTP (debug): email=' . $utilisateur->email . ' otp=' . $otp);

            Mail::to($utilisateur->email)->send(new AdminOtpMail($otp));
        } catch (\Throwable $e) {
            Log::error('AdminOtpMail failed: ' . $e->getMessage());
            return response()->json(['message' => "OTP généré, mais l’envoi email a échoué"], 500);
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

        // Le front doit rediriger vers :
        // - /admin si l’admin est connecté (email admin@kobyalgre.bf)
        // - page producteur sinon.
        // Ici on ne fait que renvoyer role + token, la logique de redirection côté front.

        $token = $utilisateur->createToken('auth_token')->plainTextToken;


        // formatUser existe dans AuthController, mais on renvoie juste le modèle ici.
        // Front utilise surtout token + role.
        return response()->json([
            'message' => 'Connexion admin réussie',
            'utilisateur' => $utilisateur,
            'token' => $token,
        ]);
    }
}


