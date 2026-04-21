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
        $query = Produit::with('producteur.utilisateur', 'typeProduit');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")
                    ->orWhere('description', 'like', "%{$s}%");
            });
        }

        if ($request->filled('typeproduit_id')) {
            $query->where('typeproduit_id', $request->typeproduit_id);
        }

        if ($request->filled('producteur_id')) {
            $query->where('producteur_id', $request->producteur_id);
        }

        if ($request->filled('prix_min')) {
            $query->where('prix', '>=', $request->prix_min);
        }

        if ($request->filled('prix_max')) {
            $query->where('prix', '<=', $request->prix_max);
        }

        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');
        $query->orderBy($sort, $order);

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'producteur_id' => 'required|exists:producteurs,id',
            'typeproduit_id' => 'nullable|exists:typeproduits,id',
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'quantite' => 'required|integer|min:0',
            'prix' => 'required|numeric|min:0'
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit = Produit::create($data);
        return response()->json($produit->load('producteur', 'typeProduit'), 201);
    }

    public function show(Produit $produit)
    {
        return response()->json($produit->load('producteur.utilisateur', 'typeProduit', 'commandes'));
    }

    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'producteur_id' => 'sometimes|required|exists:producteurs,id',
            'typeproduit_id' => 'nullable|exists:typeproduits,id',
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'quantite' => 'sometimes|required|integer|min:0',
            'prix' => 'sometimes|required|numeric|min:0'
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            if ($produit->image) {
                Storage::disk('public')->delete($produit->image);
            }
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit->update($data);
        return response()->json($produit->load('producteur', 'typeProduit'));
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();
        return response()->json(null, 204);
    }
}