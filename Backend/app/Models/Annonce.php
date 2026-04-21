<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    protected $fillable = [
        'producteur_id',
        'titre',
        'contenu'
    ];

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }
}
