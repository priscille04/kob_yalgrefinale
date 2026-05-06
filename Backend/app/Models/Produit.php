<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

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
        return $this->belongsTo(Producteur::class, 'producteur_id');
    }

    public function typeproduit()
    {
        return $this->belongsTo(TypeProduit::class, 'typeproduit_id');
    }

    public function commandes()
    {
        return $this->hasMany(Commande::class, 'produit_id');
    }
}
