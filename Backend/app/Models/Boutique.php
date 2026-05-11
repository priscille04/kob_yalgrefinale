<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Boutique extends Model
{
    protected $fillable = [
        'nom',
        'code_unique',
        'ville'
    ];

    public function producteurs()
    {
        return $this->hasMany(Producteur::class);
    }
}