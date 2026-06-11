<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeProduit extends Model
{
    protected $table = 'typeproduits';

    protected $fillable = [
        'nom',
        'produits_json'
    ];

    protected $casts = [
        'produits_json' => 'array',
    ];


    public function produits()
    {
        return $this->hasMany(Produit::class, 'typeproduit_id');
    }
}
