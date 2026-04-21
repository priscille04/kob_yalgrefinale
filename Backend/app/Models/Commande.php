<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'client_id',
        'produit_id',
        'quantite',
        'total',
        'statut'
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