<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $fillable = [
        'producteur_id',
        'typeproduit_id',
        'nom',
        'description',
        'image',
        'quantite',
        'prix'
    ];

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }

    public function typeProduit()
    {
        return $this->belongsTo(TypeProduit::class, 'typeproduit_id');
    }

    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
}