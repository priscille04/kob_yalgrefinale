<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    public function index(Request $request)
    {
        $query = Produit::with('producteur.utilisateur', 'producteur.boutique', 'typeproduit');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")
                    ->orWhere('description', 'like', "%{$s}%");
            });
        }

        $query->orderBy(
            $request->input('sort', 'created_at'),
            $request->input('order', 'desc')
        );

        return $request->has('all')
            ? response()->json($query->get())
            : response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'typeproduit_id' => 'required|exists:typeproduits,id',
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'quantite' => 'required|integer|min:0',
            'prix' => 'required|numeric|min:0',
            'producteur_id' => 'nullable|integer'
        ]);

        $data = $request->except('image');

        // producteur_id = producteurs.id (pas utilisateurs.id)
        // - si le front fournit producteur_id (admin), on le respecte
        // - sinon, on le déduit depuis le producteur connecté
        $data['producteur_id'] = $request->input('producteur_id');
        if (!$data['producteur_id'] && auth('sanctum')->check()) {
            $data['producteur_id'] = auth('sanctum')->user()?->producteur?->id;
        }

        if (!$data['producteur_id']) {
            return response()->json(['message' => 'producteur_id manquant ou compte sans producteur'], 422);
        }


        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit = Produit::create($data);

        return response()->json($produit->load('producteur.boutique', 'typeproduit'), 201);
    }

    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'typeproduit_id' => 'required|exists:typeproduits,id',
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'quantite' => 'required|integer|min:0',
            'prix' => 'required|numeric|min:0'
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            if ($produit->image) {
                Storage::disk('public')->delete($produit->image);
            }
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit->update($data);

        return response()->json($produit->load('producteur.boutique', 'typeproduit'));
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();
        return response()->json(null, 204);
    }

    public function getProducteurProduits(Request $request)
    {
        $query = Produit::with('producteur.utilisateur', 'producteur.boutique', 'typeproduit');

        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        // S'assure qu'on a bien le producteur lié au compte (plutôt que laisser une requête silencieuse échouer)
        $producteurId = $user->producteur?->id;

        if (!$producteurId) {
            return response()->json(['message' => 'Aucun producteur lié à ce compte'], 403);
        }

        $query->where('producteur_id', $producteurId);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")
                    ->orWhere('description', 'like', "%{$s}%");
            });
        }

        $query->orderBy(
            $request->input('sort', 'created_at'),
            $request->input('order', 'desc')
        );

        return $request->has('all')
            ? response()->json($query->get())
            : response()->json($query->paginate(15));
    }
}

