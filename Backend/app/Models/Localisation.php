<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Localisation extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'ville',
        'longitude',
        'latitude'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
