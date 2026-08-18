<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'reference_panier',
        'client_id',
        'produit_id',
        'quantite',
        'total',
        'statut',
        'motif_refus'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}