<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'nom',
        'numero',
        'code_abonnement',
        'type',
        'montant',
        'status',
        'date_debut',
        'date_fin'
    ];

    // BONUS (évite bugs de dates)
    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];
}