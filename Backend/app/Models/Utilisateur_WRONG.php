<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

// NOTE: this is the WRONG Utilisateur model for Sanctum auth.
// It was accidentally created at the repo root and conflicts with
// `kob-app/Backend/app/Models/Utilisateur.php`.
//
// To avoid breaking Sanctum `createToken()`, we rename the class.
class Utilisateur extends Model
{

    protected $table = 'utilisateurs';

    public function client()
    {
        return $this->hasOne(\App\Models\Client::class, 'utilisateur_id');
    }

    public function producteur()
    {
        return $this->hasOne(\App\Models\Producteur::class, 'utilisateur_id');
    }




    
    public function indexAction(Request $request)
    {
        try {
            $query = Utilisateur::query();

            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            if ($request->has('all')) {
                return response()->json($query->get());
            }

            return response()->json(
                $query->latest()->paginate($request->input('per_page', 15))
            );

        } catch (\Exception $e) {
            Log::error("Utilisateur index error: " . $e->getMessage());

            return response()->json([
                'message' => 'Erreur chargement utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeAction(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:utilisateurs',
                'telephone' => 'nullable|string|max:255',
                'mot_de_passe' => 'required|string|min:8',
                'role' => 'required|string|in:client,producteur,admin'
            ]);

            $utilisateur = Utilisateur::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'mot_de_passe' => Hash::make($request->mot_de_passe),
                'role' => $request->role,
            ]);

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'data' => $utilisateur
            ], 201);

        } catch (\Exception $e) {
            Log::error("Utilisateur store error: " . $e->getMessage());

            return response()->json([
                'message' => 'Erreur création utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showAction(Utilisateur $utilisateur)
    {
        try {
            return response()->json($utilisateur);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 404);
        }
    }

    public function updateUtilisateurAction(Request $request, Utilisateur $utilisateur)
    {
        try {
            $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:utilisateurs,email,' . $utilisateur->id,
                'telephone' => 'nullable|string|max:255',
                'mot_de_passe' => 'sometimes|required|string|min:8',
                'role' => 'sometimes|required|string|in:client,producteur,admin'
            ]);

            $data = $request->only(['nom', 'email', 'telephone', 'role']);

            if ($request->filled('mot_de_passe')) {
                $data['mot_de_passe'] = Hash::make($request->mot_de_passe);
            }

            $utilisateur->update($data);

            return response()->json([
                'message' => 'Utilisateur mis à jour',
                'data' => $utilisateur
            ]);

        } catch (\Exception $e) {
            Log::error("Utilisateur update error: " . $e->getMessage());

            return response()->json([
                'message' => 'Erreur update utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyUtilisateurAction(Utilisateur $utilisateur)
    {
        try {
            $utilisateur->delete();

            return response()->json([
                'message' => 'Utilisateur supprimé'
            ], 204);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur suppression utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

