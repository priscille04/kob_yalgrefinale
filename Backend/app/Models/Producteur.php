<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producteur extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'type_culture',
        'localisation',
        'boutique_id'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function boutique()
    {
        return $this->belongsTo(Boutique::class);
    }
}