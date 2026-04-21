<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producteur extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'type_culture',
        'localisation'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function produits()
    {
        return $this->hasMany(Produit::class);
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class);
    }
}
