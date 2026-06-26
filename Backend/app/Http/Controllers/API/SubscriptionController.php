<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function check(Request $request)
    {
        $sub = Subscription::where('nom', $request->nom)
            ->where('numero', $request->numero)
            ->where('status', 'active')
            ->first();

        return response()->json([
            'exists' => $sub ? true : false
        ]);
    }

    //  FIX COMPLET ICI
    public function createSubscription(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required|string',
                'numero' => 'required|string',
                'type' => 'required|string',
                'montant' => 'required|numeric'
            ]);

            $subscription = Subscription::create([
                'nom' => $request->nom,
                'numero' => $request->numero,
                'type' => $request->type,
                'montant' => $request->montant,
                'status' => 'pending',
                'code_abonnement' => strtoupper(Str::random(10)),
                'date_fin' => null
            ]);

            return response()->json([
                "success" => true,
                "subscription" => $subscription
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function payment(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required',
            'methode' => 'required|in:orange,moov,wave'
        ]);

        $subscription = Subscription::find($request->subscription_id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Abonnement introuvable'
            ], 404);
        }

        $message = match ($request->methode) {
            "orange" => "Paiement Orange Money validé",
            "moov" => "Paiement Moov Money validé",
            "wave" => "Paiement Wave validé",
        };

        $subscription->update([
            "status" => "active",
            "date_fin" => now()->addDays(3)
        ]);

        return response()->json([
            "success" => true,
            "message" => $message,
            "code_abonnement" => $subscription->code_abonnement,
            "status" => $subscription->status,
            "expire_le" => $subscription->date_fin
        ]);
    }

    public function validateCode(Request $request)
    {
        $subscription = Subscription::where('code_abonnement', $request->code)
            ->where('status', 'active')
            ->where('date_fin', '>', now())
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide ou expiré'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Accès autorisé',
            'subscription' => $subscription
        ]);
    }

    public function accessElearning(Request $request)
    {
        $subscription = Subscription::where('code_abonnement', $request->code)
            ->where('status', 'active')
            ->where('date_fin', '>', now())
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Accès autorisé',
            'videos' => [
                'video1.mp4','video2.mp4','video3.mp4','video4.mp4','video5.mp4',
                'video6.mp4','video7.mp4','video8.mp4','video9.mp4','video10.mp4'
            ]
        ]);
    }
}