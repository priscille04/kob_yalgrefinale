<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Boutique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    public function index(Request $request)
    {
        $query = Produit::with('producteur.utilisateur', 'typeproduit');

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
            'prix' => 'required|numeric|min:0'
        ]);

        $data = $request->except('image');

        // producteur_id auto depuis l’utilisateur connecté
        $data['producteur_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('produits', 'public');
        }

        $produit = Produit::create($data);

        return response()->json($produit->load('producteur', 'typeproduit'), 201);
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

        return response()->json($produit->load('producteur', 'typeproduit'));
    }

    public function destroy(Produit $produit)
    {
        $produit->delete();
        return response()->json(null, 204);
    }

    public function getProducteurProduits(Request $request)
    {
        $query = Produit::with('producteur.utilisateur', 'typeproduit');

        $query->where('producteur_id', auth()->user()->id);

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
