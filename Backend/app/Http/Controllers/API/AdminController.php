<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Liste des admins en attente de validation
     */
    public function pendingAdmins()
    {
        $admins = Utilisateur::where('role', 'admin')
                             ->where('is_validated', false)
                             ->get();

        return response()->json($admins);
    }

    /**
     * Valider un admin
     */
    public function validateAdmin($id)
    {
        $user = Utilisateur::findOrFail($id);

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Ce compte n’est pas un admin'], 400);
        }

        $user->is_validated = true;
        $user->save();

        return response()->json(['message' => 'Admin validé avec succès']);
    }

    /**
     * Refuser un admin
     */
    public function rejectAdmin($id)
    {
        $user = Utilisateur::findOrFail($id);

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Ce compte n’est pas un admin'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'Demande d’admin rejetée et supprimée']);
    }
}
